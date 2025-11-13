import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SummaryCards from "../../Cards/index";
import TableSimulator from "../../tables/TableSimulator";
import ChartButton from "../../Charts/ChartButton/chartButton";
import DynamicChart from "../DynamicChart/DynamicChart";
import "./simulationWrapper.css";

const SimulationWrapper = ({
  simulationType,
  title,
  icon = "tractor",
  columnsConfig,
  initialData,
}) => {
  const [data, setData] = useState(() => {
    if (!initialData) return null;
    
    const processedData = { ...initialData };
    
    Object.keys(processedData).forEach(key => {
      if (Array.isArray(processedData[key])) {
        processedData[key] = processedData[key].map(item => ({
          ...item,
          qty: item.quantidade || item.qty || 0,
          unitValue: item.valorUnitario || item.unitValue || 0,
          quantidade: item.quantidade || item.qty || 0,
          valorUnitario: item.valorUnitario || item.unitValue || 0
        }));
      }
    });
    
    return processedData;
  });
  
  const [hectares, setHectares] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [viewMode, setViewMode] = useState("summary");

  const toggleChart = useCallback(() => {
    setShowChart((prev) => !prev);
  }, []);

  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleHectaresChange = useCallback((value) => {
    const floatValue = parseFloat(value) || 1;
    setHectares(Math.max(1, floatValue));
  }, []);

  const handleEditStart = useCallback((tableType, index, field) => {
    setEditing({ type: tableType, index, field });
  }, []);

  const handleEditChange = useCallback((e, tableType, index, field) => {
    const value =
      field === "valorUnitario" || field === "unitValue" || field === "qty"
        ? parseFloat(e.target.value) || 0
        : e.target.value;

    setData((prev) => {
      if (!prev || !prev[tableType]) return prev;

      const updatedTable = prev[tableType].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : { ...item }
      );

      return { ...prev, [tableType]: updatedTable };
    });
  }, []);

  const chartData = useMemo(() => {
    if (!data)
      return { summaryValues: [], detailedLabels: [], detailedValues: [], total: 0 };

    const categories = {};
    const summaryValues = [];
    const detailedLabels = [];
    const detailedValues = [];

    const categoryOrder = simulationType === 1 
      ? ["preparoSolo", "insumos"]
      : ["preparoArea", "insumos", "preparoSolo", "servicos"];

    categoryOrder.forEach((category) => {
      if (data[category] && Array.isArray(data[category])) {
        const items = data[category];
        const subtotal = items.reduce((sum, item) => {
          const quantidade = item.qty || 0;
          const valorUnitario = item.unitValue || 0;
          return sum + quantidade * valorUnitario * hectares;
        }, 0);

        categories[category] = subtotal;
        summaryValues.push(subtotal);

        items.forEach((item) => {
          const descricao = item.descricao || item.item || "";
          const quantidade = item.qty || 0;
          const valorUnitario = item.unitValue || 0;
          detailedLabels.push(descricao);
          detailedValues.push(quantidade * valorUnitario * hectares);
        });
      }
    });

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

    const updatedSummaryValues = [...summaryValues, total];

    return {
      summaryValues: updatedSummaryValues,
      detailedLabels,
      detailedValues,
      total,
      categories: Object.keys(categories),
    };
  }, [data, hectares, simulationType]);

  const handleEditBlur = useCallback(() => {
    setEditing(null);
  }, []);

  const getTableData = useCallback(
    (tableType) => {
      if (!data || !data[tableType]) return [];
      
      return data[tableType].map((item) => {
        return {
          item: item.descricao || item.item || "",
          unit: item.unidade || item.unit || "",
          qty: item.qty || 0,
          unitValue: item.unitValue || 0,
          ...item
        };
      });
    },
    [data]
  );

  const availableTables = useMemo(() => {
    if (!data) return [];
    
    const tableOrder = simulationType === 1
      ? ["preparoSolo", "insumos"]
      : ["preparoArea", "insumos", "preparoSolo", "servicos"];
    
    return tableOrder.filter(table => 
      data[table] && Array.isArray(data[table])
    );
  }, [data, simulationType]);

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

      <div className={`tables-section ${showChart ? "hidden" : ""}`}>
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
