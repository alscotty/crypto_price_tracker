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
import { LOOKBACK_PERIOD } from '../util/sharedConstants';

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
  const chartRef = useRef(null); // Reference to chart instance

  // Calculate the trendline for the last 10 data points
  const calculateTrendline = (points) => {
    const n = points.length;
    const sumX = points.reduce((acc, _, i) => acc + i, 0); // Indices as X values
    const sumY = points.reduce((acc, point) => acc + parseFloat(point.price), 0);
    const sumXY = points.reduce((acc, point, i) => acc + i * parseFloat(point.price), 0);
    const sumX2 = points.reduce((acc, _, i) => acc + i * i, 0);

    // Calculate slope (m) and intercept (b) for y = mx + b
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate trendline points
    return points.map((_, i) => slope * i + intercept);
  };

  let trendlineData = [];
  let trendlineColor = "green"; // Default trendline color
  if (dataPoints.length >= LOOKBACK_PERIOD) {
    const lastTenDataPoints = dataPoints.slice(-LOOKBACK_PERIOD);
    trendlineData = calculateTrendline(lastTenDataPoints);
    trendlineColor = trendlineData[trendlineData.length - 1] >= trendlineData[0] ? "green" : "red";
  }

  const chartData = {
    labels: dataPoints.map((point) => point.timestamp),
    datasets: [
      {
        label: "Price Over Time",
        data: dataPoints.map((point) => parseFloat(point.price)),
        borderColor: dataPoints.map((point, index) => {
          if (index === 0) return "blue"; // Initial point
          return parseFloat(point.price) >= parseFloat(dataPoints[index - 1].price)
            ? "green"
            : "red";
        }),
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.4,
      },
      ...(trendlineData.length > 0
        ? [
          {
            label: `Trendline (Last ${LOOKBACK_PERIOD} Points)`,
            data: [
              ...Array(dataPoints.length - LOOKBACK_PERIOD).fill(null), // Empty points for alignment
              ...trendlineData, // Trendline data for the last 10 points
            ],
            borderColor: trendlineColor, // Updated to use trendlineColor
            borderDash: [5, 5], // Dashed line
            borderWidth: 2,
            tension: 0, // Straight line
            pointRadius: 0, // No points
          },
        ]
        : []),
    ],
  };

  const allTextColor = "white";

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: allTextColor,
        },
      },
      title: {
        display: false,
        text: "Live Dynamic Graph with Trendline",
        color: allTextColor,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
          color: allTextColor,
        },
        ticks: {
          color: allTextColor,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price in USD",
          color: allTextColor,
        },
        ticks: {
          color: allTextColor,
        },
      },
    },
  };

  return (
    <div>
      <h2>Live Dynamic Graph with Trendline</h2>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default DynamicGraph;
