import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function LatencyMonitor() {
  const [latencyData, setLatencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatencyData();

    // Set up polling for updates
    const intervalId = setInterval(fetchLatencyData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLatencyData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://quant-sim-api.onrender.com/latency"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch latency data");
      }

      const data = await response.json();
      setLatencyData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching latency data:", err);
      setError("Failed to load latency data");
    } finally {
      setLoading(false);
    }
  };

  const formatLatencyData = () => {
    if (!latencyData) return [];

    return [
      { name: "Min", value: latencyData.min_latency },
      { name: "Avg", value: latencyData.avg_latency },
      { name: "P95", value: latencyData.p95_latency },
      { name: "P99", value: latencyData.p99_latency },
      { name: "Max", value: latencyData.max_latency },
    ];
  };

  if (loading && !latencyData) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="animate-pulse text-blue-400">
          Loading latency data...
        </div>
      </div>
    );
  }

  if (error && !latencyData) {
    return (
      <div className="h-60 flex flex-col items-center justify-center">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchLatencyData}
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
        <div className="text-sm text-gray-400">
          {latencyData?.sample_count || 0} samples collected
        </div>

        <button
          onClick={fetchLatencyData}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formatLatencyData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} stroke="#4B5563" />
            <YAxis
              tick={{ fill: "#9CA3AF" }}
              stroke="#4B5563"
              label={{
                value: "Latency (ms)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#9CA3AF" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                borderColor: "#374151",
                color: "#F9FAFB",
              }}
              formatter={(value) => [`${value.toFixed(2)} ms`, "Latency"]}
            />
            <Legend />
            <Bar
              dataKey="value"
              name="Latency (ms)"
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LatencyMonitor;
