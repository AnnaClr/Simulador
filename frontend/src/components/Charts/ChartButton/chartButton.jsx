import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartBar,
    faTable,
    faLayerGroup,
    faListUl,
    faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "./ChartButton.css";

const handlePrint = () => {
    window.print();
}

const ChartButton = ({
    showChart,
    viewMode,
    onToggle,
    onChangeViewMode,
}) => {
    return (
        <nav className="button-container" aria-label="Controles do gráfico">
            {showChart && (
                <div className="view-mode-buttons">
                    <button
                        className={`view-button ${viewMode === "summary" ? "active" : ""}`}
                        onClick={() => onChangeViewMode("summary")}
                        aria-pressed={viewMode === "summary"}
                    >
                        <FontAwesomeIcon icon={faLayerGroup}/>
                        <span>Visão Geral</span>
                    </button>
                    <button
                        className={`view-button ${viewMode === "detailed" ? "active" : ""}`}
                        onClick={() => onChangeViewMode("detailed")}
                        aria-pressed={viewMode === "detailed"}
                    >
                        <FontAwesomeIcon icon={faListUl} />
                        <span>Detalhada</span>
                    </button>
                </div>
            )}

            <div className="action-buttons">
                <button 
                    className="print-button" 
                    onClick={handlePrint}
                    aria-label="Imprimir relatório"
                >
                    <FontAwesomeIcon icon={faPrint} />
                    <span>Imprimir</span>
                </button>
                <button
                    className={`toggle-button ${showChart ? "active" : ""}`}
                    onClick={onToggle}
                    aria-label={showChart ? "Mostrar tabelas" : "Mostrar gráfico"}
                >
                    <FontAwesomeIcon icon={showChart ? faTable : faChartBar} />
                    <span>{showChart ? "Mostrar Tabelas" : "Mostrar Gráfico"}</span>
                </button>
            </div>
        </nav>
    );
};

export default ChartButton;