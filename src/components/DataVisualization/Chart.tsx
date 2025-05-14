import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { HistoricalData } from "../../types";
import { formatShortDate } from "../../utils/formatters";
import Loader from "../UI/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: HistoricalData[];
  type: "line" | "bar";
  dataKey: keyof Omit<HistoricalData, "date">;
  title?: string;
  color?: string;
  colors?: string[];
  loading?: boolean;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({
  data,
  type,
  dataKey,
  title = "",
  color = "rgb(14, 141, 233)",
  colors,
  loading = false,
  height = 220,
}) => {
  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <Loader text="Loading data..." />
      </div>
    );
  }

  const labels = data.map((item) => formatShortDate(new Date(item.date)));
  const values = data.map((item) => item[dataKey] as number);

  // Use provided colors array if it matches data length, else fall back to single color
  const chartColors =
    colors && colors.length === data.length
      ? colors
      : Array(data.length).fill(color);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: type === "line" ? chartColors : color,
        backgroundColor:
          type === "line"
            ? chartColors.map((c) => `rgba(${c.slice(4, -1)}, 0.2)`)
            : chartColors,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: "#fff",
        pointBorderColor: color,
        fill: type === "line",
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        boxWidth: 8,
        callbacks: {
          label: function (context) {
            const value = context.raw as number;
            return `${title}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      {type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Chart;
