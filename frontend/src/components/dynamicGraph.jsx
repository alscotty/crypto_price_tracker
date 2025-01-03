import React, { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
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

const DynamicGraph = () => {
  const [dataPoints, setDataPoints] = useState([]); // State to hold data points
  const chartRef = useRef(null); // Reference to chart instance

  // Function to add a new data point
  const addDataPoint = (newPoint) => {
    setDataPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  // Prepare chart data and options
  const chartData = {
    labels: dataPoints.map((point) => point.timestamp.toLocaleTimeString()), // Format timestamps as labels
    datasets: [
      {
        label: "Value Over Time",
        data: dataPoints.map((point) => parseFloat(point.value)),
        borderColor: dataPoints.map((point, index) => {
          if (index === 0) return "green"; // Initial point
          return parseFloat(point.value) >= parseFloat(dataPoints[index - 1].value) ? "green" : "red";
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
          text: "Value",
        },
      },
    },
  };


  return (
    <div>
      <h2>Dynamic Graph</h2>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default DynamicGraph;
