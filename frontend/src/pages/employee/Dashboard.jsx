export default function EmployeeDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Attendance Today */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Today's Attendance</h2>
        <p className="text-3xl text-blue-600">92%</p>
      </div>

      {/* Tasks Assigned */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Tasks Assigned</h2>
        <p className="text-3xl text-green-600">7</p>
      </div>
    </div>
  );
}