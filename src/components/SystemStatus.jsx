function SystemStatus({ data }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const calcTimeDiff = (timestamp) => {
    if (!timestamp || !data?.current_time) return null;
    const diff = (data.current_time - timestamp) * 1000; // ms
    return diff;
  };

  const getStatusClass = (diff) => {
    if (diff === null) return "bg-gray-500";
    if (diff < 1000) return "bg-green-500"; // Less than 1 second
    if (diff < 5000) return "bg-yellow-500"; // Less than 5 seconds
    return "bg-red-500"; // 5+ seconds
  };

  // Determine if websocket is functionally connected based on data freshness
  const isEffectivelyConnected = () => {
    if (!data) return false;

    // If explicitly connected, great
    if (data.websocket_connected) return true;

    // If we have order books and recent messages, consider it effectively connected
    const hasOrderbooks =
      data.available_orderbooks &&
      Object.keys(data.available_orderbooks).length > 0;

    const hasRecentMessages =
      data.last_message_time &&
      data.current_time &&
      data.current_time - data.last_message_time < 10;

    return hasOrderbooks && hasRecentMessages;
  };

  const connected = isEffectivelyConnected();

  if (!data) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse text-gray-400">
          Loading system status...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <div
          className={`w-3 h-3 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          } mr-2`}
        ></div>
        <span className={connected ? "text-green-400" : "text-red-400"}>
          WebSocket {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-300 mb-3">
        Available Order Books
      </h3>

      <div className="space-y-3">
        {Object.entries(data.available_orderbooks || {}).map(
          ([key, orderbook]) => {
            const timeDiff = calcTimeDiff(data.last_message_time);
            return (
              <div key={key} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">{key}</div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusClass(
                        timeDiff
                      )} mr-1`}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {timeDiff !== null
                        ? `${timeDiff.toFixed(0)}ms ago`
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Top Ask:</span>{" "}
                    <span className="font-mono">{orderbook.top_ask}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Top Bid:</span>{" "}
                    <span className="font-mono">{orderbook.top_bid}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ask Levels:</span>{" "}
                    <span>{orderbook.ask_levels}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Bid Levels:</span>{" "}
                    <span>{orderbook.bid_levels}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Last Update:</span>{" "}
                    <span>
                      {formatTime(Date.parse(orderbook.timestamp) / 1000)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        )}

        {Object.keys(data.available_orderbooks || {}).length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No orderbooks available
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-right text-gray-400">
        Last message: {formatTime(data.last_message_time)}
      </div>
    </div>
  );
}

export default SystemStatus;
