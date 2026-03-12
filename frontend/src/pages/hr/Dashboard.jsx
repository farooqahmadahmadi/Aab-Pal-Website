export default function HRDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Attendance Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Today's Attendance</h2>
        <p className="text-3xl text-blue-600">98%</p>
      </div>

      {/* New Hires */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">New Hires</h2>
        <p className="text-3xl text-green-600">5</p>
      </div>
    </div>
  );
}