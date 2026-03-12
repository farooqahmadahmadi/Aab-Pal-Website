export default function DataEntryDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Records Entered Today */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Records Entered Today</h2>
        <p className="text-3xl text-blue-600">45</p>
      </div>

      {/* Total Records */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Total Records</h2>
        <p className="text-3xl text-green-600">1,230</p>
      </div>
    </div>
  );
}