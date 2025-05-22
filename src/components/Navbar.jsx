function Navbar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-500">Quant Sim</h1>
            </div>
            <div className="ml-4 text-gray-300 text-sm">
              High Frequency Trading Simulator
            </div>
          </div>
          <div className="flex items-center">
            <span className="bg-green-500 rounded-full h-3 w-3 mr-2 animate-pulse"></span>
            <span className="text-xs text-gray-300">Live Data</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
