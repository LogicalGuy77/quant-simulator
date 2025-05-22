import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SimulationForm from "./components/SimulationForm";
import MetricsDisplay from "./components/MetricsDisplay";
import HistoricalMetricsChart from "./components/HistoricalMetricsChart";
import LatencyMonitor from "./components/LatencyMonitor";
import OrderbookVisualizer from "./components/OrderbookVisualizer";
import SystemStatus from "./components/SystemStatus";
import "./App.css";

function App() {
  const [currentAsset, setCurrentAsset] = useState("BTC-USDT-SWAP");
  const [assets, setAssets] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});

  // Fetch available assets
  useEffect(() => {
    fetch("https://quant-sim-api.onrender.com/assets")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data.assets);
      })
      .catch((err) => console.error("Failed to fetch assets:", err));

    // Fetch initial system status
    fetch("https://quant-sim-api.onrender.com/status")
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus(data);
      })
      .catch((err) => console.error("Failed to fetch system status:", err));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          assets={assets}
          currentAsset={currentAsset}
          setCurrentAsset={setCurrentAsset}
        />
        <main className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <SimulationForm currentAsset={currentAsset} />
            </div>
            <div>
              <MetricsDisplay assetId={currentAsset} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-400">
                Order Book
              </h2>
              <OrderbookVisualizer assetId={currentAsset} />
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-400">
                System Status
              </h2>
              <SystemStatus data={systemStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-400">
                Historical Metrics
              </h2>
              <HistoricalMetricsChart assetId={currentAsset} />
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-400">
                Latency Monitor
              </h2>
              <LatencyMonitor />
            </div>
          </div>
        </main>
      </div>
      <footer className="bg-gray-800 text-center p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          Connect with me:
          <a
            href="https://github.com/LogicalGuy77"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            GitHub
          </a>{" "}
          |
          <a
            href="https://x.com/HarshitNay80531"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            X
          </a>{" "}
          |
          <a
            href="https://www.linkedin.com/in/harshit-nayan-9913bb266/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
