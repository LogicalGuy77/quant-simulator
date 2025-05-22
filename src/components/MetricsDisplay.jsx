import { useState, useEffect, useRef } from "react";

function MetricsDisplay({ assetId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const websocket = useRef(null);

  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    // Setup WebSocket connection
    const wsUrl = `wss://quant-sim-api.onrender.com/ws/metrics/${assetId.toLowerCase()}`;
    websocket.current = new WebSocket(wsUrl);

    websocket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "metrics_update") {
        setMetrics(data.data);
        setLoading(false);
      }
    };

    websocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Failed to connect to real-time data");
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [assetId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://quant-sim-api.onrender.com/continuous-metrics/${assetId.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
        <div className="animate-pulse text-blue-400">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-red-400">{error}</div>
        <button
          onClick={fetchMetrics}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-400">Live Metrics</h2>
        <div className="text-xs text-gray-400">
          Last update: {metrics ? formatTime(metrics.timestamp) : "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-400">Current Price</span>
          </div>
          <div className="text-xl font-mono mt-1">
            ${metrics?.mid_price.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-400">Net Cost</span>
          </div>
          <div className="text-xl font-mono mt-1">
            {metrics?.net_cost.toFixed(5)}%
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-400">Slippage</span>
          </div>
          <div className="text-xl font-mono mt-1">
            {metrics?.slippage.toFixed(5)}%
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-400">Market Impact</span>
          </div>
          <div className="text-xl font-mono mt-1">
            {metrics?.market_impact.toFixed(5)}%
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Fee Breakdown
        </h3>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-gray-400">Maker Fee:</div>
            <div className="text-sm text-right">
              ${metrics?.fees.maker_fee.toFixed(6)}
            </div>

            <div className="text-sm text-gray-400">Taker Fee:</div>
            <div className="text-sm text-right">
              ${metrics?.fees.taker_fee.toFixed(6)}
            </div>

            <div className="text-sm text-gray-400">Effective Rate:</div>
            <div className="text-sm text-right">
              {(metrics?.fees.effective_rate * 100).toFixed(4)}%
            </div>

            <div className="text-sm font-semibold text-gray-300">
              Total Fee:
            </div>
            <div className="text-sm font-semibold text-right">
              ${metrics?.fees.total_fee.toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Internal processing latency: {metrics?.internal_latency.toFixed(3)} ms
      </div>
    </div>
  );
}

export default MetricsDisplay;
