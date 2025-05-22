function Sidebar({ assets, currentAsset, setCurrentAsset }) {
  return (
    <div className="w-64 bg-gray-800 shadow-md p-4 border-r border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Assets</h2>
      <ul className="space-y-2">
        {assets.map((asset) => (
          <li
            key={asset}
            className={`p-2 cursor-pointer rounded hover:bg-gray-700 transition-colors ${
              currentAsset === asset
                ? "bg-blue-900 text-blue-100"
                : "text-gray-300"
            }`}
            onClick={() => setCurrentAsset(asset)}
          >
            {asset}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Fee Tiers</h2>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="p-2">VIP0: 0.08% / 0.10%</li>
          <li className="p-2">VIP1: 0.07% / 0.09%</li>
          <li className="p-2">VIP2: 0.06% / 0.08%</li>
          <li className="p-2">VIP3: 0.05% / 0.07%</li>
          <li className="p-2">VIP4: 0.04% / 0.06%</li>
          <li className="p-2">VIP5: 0.03% / 0.05%</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
