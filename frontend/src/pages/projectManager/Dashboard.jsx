export default function PMDashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Ongoing Projects */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Ongoing Projects</h2>
        <p className="text-3xl text-blue-600">8</p>
      </div>

      {/* Team Members */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Team Members</h2>
        <p className="text-3xl text-green-600">35</p>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Upcoming Deadlines</h2>
        <p className="text-3xl text-red-600">4</p>
      </div>
    </div>
  );
}