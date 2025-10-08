import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DynamicChart from '../DynamicChart/DynamicChart';
import ChartButton from '../../Charts/ChartButton/chartButton';
import SummaryCards from '../../Cards/index';
import TableSimulator from '../../tables/TableSimulator';
import apiService from '../../../services/util/apiService';
import './simulationWrapper.css';

const SimulationWrapper = ({
    simulationType,
    title,
    icon = "tractor",
    columnsConfig
}) => {
    const [hectares, setHectares] = useState(1);
    const [editing, setEditing] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [viewMode, setViewMode] = useState("summary");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const backendData = await apiService.getSimulationData(simulationType);
                setData(backendData);
            } catch (err) {
                setError('Erro ao carregar dados do servidor. Verifique se o backend está rodando.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [simulationType]);

    const toggleChart = () => setShowChart(!showChart);
    const changeViewMode = (mode) => setViewMode(mode);

    const handleHectaresChange = (value) => {
        const intValue = parseInt(value) || 1;
        setHectares(Math.max(1, intValue));
    };

    const calculate = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => {
            const quantidade = item.quantidade || item.qty || 0;
            const valorUnitario = item.valorUnitario || item.unitValue || 0;
            return sum + (quantidade * valorUnitario * hectares);
        }, 0);
    };

    const chartData = useMemo(() => {
        if (!data) return { summaryValues: [], detailedLabels: [], detailedValues: [], total: 0 };

        const categories = {};
        const summaryValues = [];
        const detailedLabels = [];
        const detailedValues = [];
        
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && key !== 'hectaresPlantas' && key !== 'titulo' && 
                !key.includes('subtotal') && !key.includes('valorTotal')) {
                
                const items = data[key];
                const total = calculate(items);
                categories[key] = total;
                summaryValues.push(total);

                items.forEach(item => {
                    const descricao = item.descricao || item.item || '';
                    const quantidade = item.quantidade || item.qty || 0;
                    const valorUnitario = item.valorUnitario || item.unitValue || 0;
                    
                    detailedLabels.push(descricao);
                    detailedValues.push(quantidade * valorUnitario * hectares);
                });
            }
        });

        const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
        summaryValues.push(total);

        return {
            summaryValues,
            detailedLabels,
            detailedValues,
            total
        };
    }, [data, hectares]);

    const handleEditStart = (tableType, index, field) => {
        setEditing({ type: tableType, index, field });
    };

    const handleEditChange = (e, tableType, index, field) => {
        const value = field === 'valorUnitario' || field === 'unitValue' ? 
            parseFloat(e.target.value) || 0 : 
            e.target.value;

        setData(prev => ({
            ...prev,
            [tableType]: prev[tableType].map((item, idx) =>
                idx === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSaveToBackend = async () => {
        try {
            setLoading(true);
            const result = await apiService.postRecalculation(simulationType, {
                hectares,
                data
            });
            setData(result);
            alert('✅ Dados salvos com sucesso no servidor!');
        } catch (err) {
            console.error('Erro ao salvar:', err);
            setError('❌ Erro ao salvar dados no servidor');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando dados do servidor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>❌ Erro ao carregar dados</h3>
                <p>{error}</p>
                <p>Verifique se o backend está rodando na porta 3000.</p>
                <button onClick={() => window.location.reload()}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="error-container">
                <h3>❌ Nenhum dado disponível</h3>
                <p>Não foi possível carregar os dados da simulação.</p>
            </div>
        );
    }

    const getTableData = (tableType) => {
        if (!data[tableType]) return [];
        
        return data[tableType].map(item => ({
            item: item.descricao || '',
            unit: item.unidade || '',
            qty: item.quantidade || 0,
            unitValue: item.valorUnitario || 0,
            ...item
        }));
    };

    const availableTables = Object.keys(data).filter(key => 
        Array.isArray(data[key]) && 
        key !== 'hectaresPlantas' && 
        key !== 'titulo' &&
        !key.includes('subtotal') &&
        !key.includes('valorTotal')
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>
                        <FontAwesomeIcon icon={icon} className="header-icon" />
                        {data.titulo || title}
                    </h1>
                </div>
            </header>

            {error && (
                <div className="alert-message error">
                    {error}
                </div>
            )}

            <SummaryCards
                hectares={hectares}
                editing={editing}
                setEditing={setEditing}
                setHectares={handleHectaresChange}
                consolidatedTotal={chartData.total}
                plantas={data.hectaresPlantas?.qtdPlantas || 204}
            />

            <div className={`tables-section ${showChart ? 'hidden' : ''}`}>
                {availableTables.map((tableType) => (
                    <TableSimulator
                        key={tableType}
                        tableData={getTableData(tableType)}
                        tableType={tableType}
                        columnsConfig={columnsConfig}
                        editing={editing}
                        handleEditStart={handleEditStart}
                        handleEditChange={(e) => handleEditChange(e, tableType, editing?.index, editing?.field)}
                        handleEditBlur={() => setEditing(null)}
                        hectares={hectares}
                    />
                ))}
            </div>

            {showChart && (
                <div className="chart-section">
                    <DynamicChart
                        data={chartData}
                        viewMode={viewMode}
                        simulationType={simulationType}
                    />
                </div>
            )}

            <div className="action-buttons">
                <ChartButton
                    showChart={showChart}
                    viewMode={viewMode}
                    onToggle={toggleChart}
                    onChangeViewMode={changeViewMode}
                />
            </div>
        </div>
    );
};

export default SimulationWrapper;
