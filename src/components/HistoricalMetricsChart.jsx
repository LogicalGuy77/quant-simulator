import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function HistoricalMetricsChart({ assetId }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState("net_cost");

  useEffect(() => {
    fetchHistoricalData();

    // Set up polling for updates
    const intervalId = setInterval(fetchHistoricalData, 5000);

    return () => clearInterval(intervalId);
  }, [assetId]);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://quant-sim-api.onrender.com/continuous-metrics-history/${assetId.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }

      const data = await response.json();

      // Process data for the chart
      const chartData = data.map((item) => ({
        timestamp: new Date(item.timestamp * 1000).toLocaleTimeString(),
        slippage: item.slippage,
        market_impact: item.market_impact,
        net_cost: item.net_cost,
        mid_price: item.mid_price,
        maker_proportion: item.maker_taker_proportion * 100,
      }));

      setHistoricalData(chartData);
      setError(null);
    } catch (err) {
      console.error("Error fetching historical data:", err);
      setError("Failed to load historical data");
    } finally {
      setLoading(false);
    }
  };

  const handleMetricChange = (e) => {
    setMetric(e.target.value);
  };

  const metrics = [
    { id: "net_cost", name: "Net Cost (%)", color: "#10B981" },
    { id: "slippage", name: "Slippage (%)", color: "#FBBF24" },
    { id: "market_impact", name: "Market Impact (%)", color: "#EF4444" },
    {
      id: "mid_price",
      name: "Price (USD)",
      color: "#3B82F6",
      yAxisId: "price",
    },
    { id: "maker_proportion", name: "Maker Proportion (%)", color: "#8B5CF6" },
  ];

  const selectedMetricInfo = metrics.find((m) => m.id === metric);

  if (loading && historicalData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse text-blue-400">
          Loading historical data...
        </div>
      </div>
    );
  }

  if (error && historicalData.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchHistoricalData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <select
            value={metric}
            onChange={handleMetricChange}
            className="bg-gray-700 border border-gray-600 rounded p-1 text-white text-sm"
          >
            {metrics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {historicalData.length > 0 && (
            <div className="text-xs text-gray-400">
              {historicalData.length} data points
            </div>
          )}
        </div>

        <button
          onClick={fetchHistoricalData}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: "#9CA3AF" }}
              stroke="#4B5563"
              tickFormatter={(tick, index) => {
                // Show fewer ticks for better readability
                return index % 5 === 0 ? tick : "";
              }}
            />
            <YAxis
              tick={{ fill: "#9CA3AF" }}
              stroke="#4B5563"
              domain={
                selectedMetricInfo.id === "mid_price"
                  ? ["auto", "auto"]
                  : [0, "auto"]
              }
              yAxisId={selectedMetricInfo.yAxisId || "default"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#374151",
                color: "#F9FAFB",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              name={selectedMetricInfo.name}
              stroke={selectedMetricInfo.color}
              activeDot={{ r: 8 }}
              yAxisId={selectedMetricInfo.yAxisId || "default"}
              dot={{ r: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HistoricalMetricsChart;
