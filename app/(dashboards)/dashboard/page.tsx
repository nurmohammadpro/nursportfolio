export default function ClientDashboard() {
  return (
    <div>
      <h2 className="text-xl font-medium text-gray-600 mb-6">Welcome Back</h2>
      <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Active Service
        </h4>
        <p className="text-lg text-gray-700 mt-1">Web App Development</p>
      </div>
      {/* Custom Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">75%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
