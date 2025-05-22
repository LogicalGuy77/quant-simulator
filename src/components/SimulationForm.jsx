import { useState, useEffect } from "react";

function SimulationForm({ currentAsset }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    exchange: "okx",
    asset: currentAsset,
    order_type: "market",
    quantity: 100,
    volatility: 0.1,
    fee_tier: "VIP0",
  });

  // Update asset when currentAsset changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, asset: currentAsset }));
  }, [currentAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "volatility"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://quant-sim-api.onrender.com/simulate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Trade Simulator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Exchange</label>
            <select
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              disabled
            >
              <option value="okx">OKX</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Asset</label>
            <input
              type="text"
              name="asset"
              value={formData.asset}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">
              Order Type
            </label>
            <select
              name="order_type"
              value={formData.order_type}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              disabled
            >
              <option value="market">Market</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">
              Quantity (USD)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              step="1"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">
              Volatility
            </label>
            <input
              type="number"
              name="volatility"
              value={formData.volatility}
              onChange={handleChange}
              min="0.01"
              max="1"
              step="0.01"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Fee Tier</label>
            <select
              name="fee_tier"
              value={formData.fee_tier}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            >
              <option value="VIP0">VIP0</option>
              <option value="VIP1">VIP1</option>
              <option value="VIP2">VIP2</option>
              <option value="VIP3">VIP3</option>
              <option value="VIP4">VIP4</option>
              <option value="VIP5">VIP5</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          disabled={loading}
        >
          {loading ? "Simulating..." : "Simulate Trade"}
        </button>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-gray-700 rounded shadow-inner">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Simulation Results
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-gray-400">Slippage:</div>
            <div className="text-white font-mono">
              {results.slippage.toFixed(4)}%
            </div>

            <div className="text-gray-400">Market Impact:</div>
            <div className="text-white font-mono">
              {results.market_impact.toFixed(4)}%
            </div>

            <div className="text-gray-400">Maker/Taker:</div>
            <div className="text-white font-mono">
              {(results.maker_taker_proportion * 100).toFixed(2)}% /{" "}
              {((1 - results.maker_taker_proportion) * 100).toFixed(2)}%
            </div>

            <div className="text-gray-400">Total Fee:</div>
            <div className="text-white font-mono">
              ${results.fees.total_fee.toFixed(6)}
            </div>

            <div className="text-gray-400">Net Cost:</div>
            <div className="text-white font-mono">
              ${results.net_cost.toFixed(6)}
            </div>

            <div className="text-gray-400">Processing Time:</div>
            <div className="text-white font-mono">
              {results.internal_latency.toFixed(3)} ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimulationForm;
