import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DynamicGraph = ({ dataPoints }) => {
  const chartRef = useRef(null); 

  const chartData = {
    labels: dataPoints.map((point) => point.timestamp),
    datasets: [
      {
        label: "Price Over Time",
        data: dataPoints.map((point) => parseFloat(point.price)),
        borderColor: dataPoints.map((point, index) => {
          if (index === 0) return "green"; // Initial point
          return parseFloat(point.price) >= parseFloat(dataPoints[index - 1].price) ? "green" : "red";
        }),
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price in USD",
        },
      },
    },
  };

  return (
    <div>
      <h2>Live Dynamic Graph</h2>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default DynamicGraph;
