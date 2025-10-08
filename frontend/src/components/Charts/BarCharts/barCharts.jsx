import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function BarChart({ data, viewMode }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: getChartData(),
      options: getChartOptions(),
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, viewMode]);

  const getChartData = () => {
    const isDetailed = viewMode === "detailed";

    return {
      labels: isDetailed
        ? data.detailedLabels
        : ["Preparo do Solo", "Insumos", "Total"],
      datasets: [
        {
          label: isDetailed
            ? "Valor por Item (R$)"
            : "Valor por Categoria (R$)",
          data: isDetailed
            ? data.detailedValues
            : [data.preparoSoloTotal, data.insumosTotal, data.total],
          backgroundColor: isDetailed
            ? createGradientColors(data.detailedValues.length, 0.7)
            : ["#E67E22", "#3498DB", "#2ECC71"],
          borderColor: isDetailed
            ? createGradientColors(data.detailedValues.length, 1)
            : ["#D35400", "#2980B9", "#27AE60"],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  };

  const createGradientColors = (count, opacity = 1) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = ((i * 360) / count) % 360;
      colors.push(`hsla(${hue}, 75%, 60%, ${opacity})`);
    }
    return colors;
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2C3E50",
        titleColor: "#ECF0F1",
        bodyColor: "#ECF0F1",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: R$ ${context.raw.toLocaleString(
              "pt-BR",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#7F8C8D",
          callback: (value) => `R$ ${value.toLocaleString("pt-BR")}`,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#34495E",
          maxRotation: viewMode === "detailed" ? 45 : 0,
          minRotation: viewMode === "detailed" ? 45 : 0,
          font: {
            weight: viewMode === "detailed" ? "normal" : "bold",
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  });

  return <canvas ref={chartRef} />;
}
