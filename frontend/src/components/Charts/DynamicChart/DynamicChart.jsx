import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import "./DynamicChart.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

  const DynamicChart = ({ data, viewMode, simulationType }) => {
    const modernTableColors = [
      'rgba(220, 38, 38, 0.7)',
      'rgba(234, 179, 8, 0.7)',
      'rgba(14, 165, 233, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(168, 85, 247, 0.7)',
      'rgba(249, 115, 22, 0.7)',
      'rgba(239, 68, 68, 0.7)'
    ];

    const modernTableBorderColors = [
      'rgba(220, 38, 38, 0.7)',
      'rgba(234, 179, 8, 0.7)',
      'rgba(14, 165, 233, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(168, 85, 247, 0.7)',
      'rgba(249, 115, 22, 0.7)',
      'rgba(239, 68, 68, 0.7)'
    ];


    const labels = viewMode == 'summary'
        ? simulationType == 1
            ? ['Preparo Solo', 'Insumos', 'Total']
            : ['Preparo Área', 'Insumos', 'Serviços', 'Total']
        : data.detailedLabels;

    const values = viewMode == 'summary' ? data.summaryValues : data.detailedValues;

    const getColors = (count) => {
        if (viewMode == 'summary') {
            if (simulationType == 1) {
                return {
                    bg: [modernTableBorderColors[1], modernTableBorderColors[2], modernTableBorderColors[5]],
                    border: [modernTableColors[1], modernTableColors[2], modernTableColors[5]]
                };
            } else {
                return {
                    bg: [modernTableBorderColors[1], modernTableBorderColors[2], modernTableBorderColors[3], modernTableBorderColors[5]],
                    border: [modernTableColors[1], modernTableColors[2], modernTableColors[3], modernTableColors[5]]
                };
            }
        }
        return {
            bg: modernTableBorderColors.slice(0, count),
            border: modernTableColors.slice(0, count)
        };
    };

    const colors = getColors(values.length);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Custos (R$)',
                data: values,
                backgroundColor: colors.bg,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `R$ ${ctx.raw.toFixed(2)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `R$ ${value}`
                }
            }
        }
    };

    return (
        <figure className="chart-responsive-container" aria-label="Gráfico de custos da simulação">
            <div className="chart-scroll-wrapper">
                <div className="chart-wrapper">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        </figure>
    );
};

export default DynamicChart;