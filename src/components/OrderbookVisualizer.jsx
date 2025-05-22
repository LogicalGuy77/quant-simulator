import { useState, useEffect, useRef } from "react";

function OrderbookVisualizer({ assetId }) {
  const [orderBookData, setOrderBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const websocket = useRef(null);

  useEffect(() => {
    // Close existing connection if any
    if (websocket.current) {
      websocket.current.close();
    }

    // Setup WebSocket connection
    const wsUrl = `wss://quant-sim-api.onrender.com/ws`;

    try {
      websocket.current = new WebSocket(wsUrl);

      websocket.current.onopen = () => {
        setConnected(true);
        setError(null);

        // Send a ping message to keep the connection alive
        websocket.current.send(JSON.stringify({ type: "ping" }));
      };

      websocket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "update" || data.type === "initial") {
            const key = `okx:${assetId.toLowerCase()}`;

            if (data.data && data.data[key]) {
              setOrderBookData(data.data[key]);
              setLoading(false);
              setError(null);
            } else {
              // Still set loading to false even if we don't have data for this asset
              setLoading(false);
            }
          } else if (data.type === "error") {
            setError(data.message || "Server reported an error");
          }
        } catch (err) {
          setError("Error processing data from server");
        }
      };

      websocket.current.onerror = (event) => {
        setError("Failed to connect to real-time data");
        setConnected(false);
      };

      websocket.current.onclose = (event) => {
        setConnected(false);

        // Don't show error if we closed it intentionally
        if (event.code !== 1000) {
          setError("Connection to server lost. Please refresh.");
        }
      };
    } catch (err) {
      setError("Could not establish connection to server");
    }

    // Cleanup function
    return () => {
      if (websocket.current) {
        // Set a flag to prevent error on intentional close
        websocket.current.close(1000, "Component unmounted");
      }
    };
  }, [assetId]); // Re-connect when assetId changes

  // Keep-alive ping
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (
        websocket.current &&
        websocket.current.readyState === WebSocket.OPEN
      ) {
        websocket.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pingInterval);
  }, []);

  const calculateTotal = (levels) => {
    if (!levels || !Array.isArray(levels)) return 0;
    return levels.reduce((sum, level) => sum + parseFloat(level[1]), 0);
  };

  const calculateMaxVolume = (asks, bids) => {
    if (!asks || !bids || !Array.isArray(asks) || !Array.isArray(bids))
      return 1;
    const maxAskVolume = Math.max(...asks.map((ask) => parseFloat(ask[1])));
    const maxBidVolume = Math.max(...bids.map((bid) => parseFloat(bid[1])));
    return Math.max(maxAskVolume, maxBidVolume);
  };

  // Status indicator
  const connectionStatus = () => (
    <div className="flex items-center mb-4 text-xs">
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span className={connected ? "text-green-400" : "text-red-400"}>
        {connected ? "Connected" : "Disconnected"}
      </span>
      {connected && !orderBookData && (
        <span className="ml-2 text-yellow-400">Waiting for data...</span>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        {connectionStatus()}
        <div className="animate-pulse text-blue-400">Loading order book...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        {connectionStatus()}
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!orderBookData || !orderBookData.asks || !orderBookData.bids) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        {connectionStatus()}
        <div className="text-gray-400">
          Waiting for order book data for {assetId}...
        </div>
      </div>
    );
  }

  const asks = orderBookData.asks.slice(0, 10);
  const bids = orderBookData.bids.slice(0, 10);
  const maxVolume = calculateMaxVolume(asks, bids);

  const spread = parseFloat(asks[0][0]) - parseFloat(bids[0][0]);
  const spreadPercentage = (spread / parseFloat(bids[0][0])) * 100;

  return (
    <div>
      {connectionStatus()}

      <div className="flex justify-between mb-3">
        <div className="text-sm text-gray-300">
          Spread:{" "}
          <span className="font-mono">
            {spread.toFixed(1)} ({spreadPercentage.toFixed(4)}%)
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Depth:{" "}
          <span className="font-mono">
            {calculateTotal(bids).toFixed(2)} /{" "}
            {calculateTotal(asks).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="bg-gray-900 p-2 rounded">
          <div className="text-green-500 text-sm font-semibold mb-2 text-center">
            Bids
          </div>
          <div className="space-y-1">
            {bids.map((bid, index) => {
              const price = parseFloat(bid[0]);
              const volume = parseFloat(bid[1]);
              const percentage = (volume / maxVolume) * 100;

              return (
                <div key={`bid-${index}`} className="flex items-center text-xs">
                  <div className="w-20 text-gray-400">{price.toFixed(1)}</div>
                  <div className="flex-1 h-5 relative">
                    <div
                      className="absolute top-0 right-0 h-full bg-green-900 opacity-30"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute top-0 right-0 h-full flex items-center justify-end pr-2">
                      {volume.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900 p-2 rounded">
          <div className="text-red-500 text-sm font-semibold mb-2 text-center">
            Asks
          </div>
          <div className="space-y-1">
            {asks.map((ask, index) => {
              const price = parseFloat(ask[0]);
              const volume = parseFloat(ask[1]);
              const percentage = (volume / maxVolume) * 100;

              return (
                <div key={`ask-${index}`} className="flex items-center text-xs">
                  <div className="w-20 text-gray-400">{price.toFixed(1)}</div>
                  <div className="flex-1 h-5 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-red-900 opacity-30"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute top-0 left-0 h-full flex items-center pl-2">
                      {volume.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderbookVisualizer;
