import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

    useEffect(() => {
        console.log("%c[Render] SimulationWrapper montado", "color: cyan;");
        return () => console.log("%c[Render] SimulationWrapper desmontado", "color: orange;");
    }, []);

    console.log("%c[Render] Re-render do componente principal", "color: lime;");

    useEffect(() => {
        let isMounted = true;
        console.log("%c[Effect] Buscando dados do backend...", "color: yellow;");

        const fetchData = async () => {
            try {
                const backendData = await apiService.getSimulationData(simulationType);
                if (!isMounted) return;

                console.log("%c[API] Dados recebidos:", "color: lightgreen;", backendData);

                setData(prev => {
                    const same = JSON.stringify(prev) === JSON.stringify(backendData);
                    if (same) {
                        console.log("%c[State] Dados idênticos, não atualizar", "color: gray;");
                        return prev;
                    }
                    console.log("%c[State] Atualizando dados...", "color: green;");
                    return backendData;
                });

                if (
                    backendData?.hectares &&
                    Number(backendData.hectares) !== Number(hectares) &&
                    !isNaN(backendData.hectares) &&
                    backendData.hectares > 0
                ) {
                    console.log("%c[State] Atualizando hectares:", "color: pink;", backendData.hectares);
                    setHectares(Number(backendData.hectares));
                }

            } catch (err) {
                console.error("%c[Erro] Falha ao buscar dados:", "color: red;", err);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [simulationType]);

    const toggleChart = useCallback(() => {
        console.log("%c[Ação] Toggle chart", "color: violet;");
        setShowChart(prev => !prev);
    }, []);

    const changeViewMode = useCallback((mode) => {
        console.log("%c[Ação] Modo de visualização alterado:", "color: violet;", mode);
        setViewMode(mode);
    }, []);

    const handleHectaresChange = useCallback((value) => {
        const floatValue = parseFloat(value) || 1;
        console.log("%c[Ação] Hectares alterado:", "color: violet;", floatValue);
        setHectares(Math.max(1, floatValue));
    }, []);

    const calculate = useCallback((items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => {
            const quantidade = item.quantidade || item.qty || 0;
            const valorUnitario = item.valorUnitario || item.unitValue || 0;
            return sum + (quantidade * valorUnitario * hectares);
        }, 0);
    }, [hectares]);

    const chartData = useMemo(() => {
        console.log("%c[Memo] Recalculando chartData...", "color: lightblue;");
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

        return { summaryValues, detailedLabels, detailedValues, total };
    }, [data, hectares, calculate]);

    const handleEditStart = useCallback((tableType, index, field) => {
        console.log("%c[Ação] Início de edição:", "color: violet;", tableType, index, field);
        setEditing({ type: tableType, index, field });
    }, []);

    const handleEditChange = useCallback((e, tableType, index, field) => {
        const value = field === 'valorUnitario' || field === 'unitValue'
            ? parseFloat(e.target.value) || 0
            : e.target.value;

        console.log("%c[Ação] Editando valor:", "color: violet;", { tableType, index, field, value });

        setData(prev => ({
            ...prev,
            [tableType]: prev[tableType].map((item, idx) =>
                idx === index ? { ...item, [field]: value } : item
            )
        }));
    }, []);

    const handleEditBlur = useCallback(() => {
        console.log("%c[Ação] Edição finalizada", "color: violet;");
        setEditing(null);
    }, []);

    const handleSaveToBackend = useCallback(async () => {
        console.log("%c[Ação] Salvando no backend...", "color: yellow;");
        try {
            const result = await apiService.postRecalculation(simulationType, {
                hectares,
                data
            });
            console.log("%c[API] Resultado do salvamento:", "color: lightgreen;", result);
            setData(result);
        } catch (err) {
            console.error("%c[Erro] Falha ao salvar:", "color: red;", err);
        }
    }, [simulationType, hectares, data]);

    const getTableData = useCallback((tableType) => {
        if (!data[tableType]) return [];
        return data[tableType].map(item => ({
            item: item.descricao || '',
            unit: item.unidade || '',
            qty: item.quantidade || 0,
            unitValue: item.valorUnitario || 0,
            ...item
        }));
    }, [data]);

    const availableTables = useMemo(() => {
        const tables = Object.keys(data || {}).filter(key =>
            Array.isArray(data[key]) &&
            key !== 'hectaresPlantas' &&
            key !== 'titulo' &&
            !key.includes('subtotal') &&
            !key.includes('valorTotal')
        );
        console.log("%c[Memo] Tabelas disponíveis:", "color: lightblue;", tables);
        return tables;
    }, [data]);

    if (!data) return null;

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
                        handleEditChange={(e) =>
                            handleEditChange(e, tableType, editing?.index, editing?.field)
                        }
                        handleEditBlur={handleEditBlur}
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