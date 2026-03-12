export default function FinanceDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Monthly Revenue */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Monthly Revenue</h2>
        <p className="text-3xl text-green-600">$45,000</p>
      </div>

      {/* Pending Payments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Pending Payments</h2>
        <p className="text-3xl text-red-600">$12,500</p>
      </div>
    </div>
  );
}