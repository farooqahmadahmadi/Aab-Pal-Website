export default function ClientDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Active Projects */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Active Projects</h2>
        <p className="text-3xl text-blue-600">3</p>
      </div>

      {/* Pending Invoices */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Pending Invoices</h2>
        <p className="text-3xl text-red-600">$4,200</p>
      </div>
    </div>
  );
}