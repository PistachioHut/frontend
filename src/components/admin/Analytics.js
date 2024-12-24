import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Analytics = () => {
  const [startDate, setStartDate] = useState("1970-01-01"); // Start from a far past date
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format today's date as "YYYY-MM-DD"
  });
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/profit`,
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );

      const { daily_data, total_revenue, total_loss, total_profit } = response.data;

      // Prepare data for the chart
      const labels = Object.keys(daily_data);
      const profitData = labels.map((date) => daily_data[date].profit);
      const lossData = labels.map((date) => daily_data[date].loss);

      setChartData({
        labels,
        datasets: [
          {
            label: "Profit",
            data: profitData,
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.2)",
          },
          {
            label: "Loss",
            data: lossData,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          },
        ],
      });

      setSummary({ total_revenue, total_loss, total_profit });
    } catch (err) {
      console.error("Failed to fetch profit data:", err);
      setError("Failed to load profit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Profit & Loss Visualization</h1>

      <div className="flex items-center space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          onClick={fetchProfitData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Fetch Data
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {summary && (
        <div className="mb-6">
          <p className="text-lg">
            <strong>Total Revenue:</strong> ${summary.total_revenue.toFixed(2)}
          </p>
          <p className="text-lg">
            <strong>Total Loss:</strong> ${summary.total_loss.toFixed(2)}
          </p>
          <p className="text-lg">
            <strong>Total Profit:</strong> ${summary.total_profit.toFixed(2)}
          </p>
        </div>
      )}

        {chartData && (
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <Line data={chartData} />
          </div>
        )}

    </div>
  );
};

export default Analytics;
