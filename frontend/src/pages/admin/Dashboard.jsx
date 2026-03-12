export default function Dashboard() {
  const stats = [
    { title: "Total Sales", value: "$12,345" },
    { title: "Total Expense", value: "$3,213" },
    { title: "Total Users", value: "1,245" },
    { title: "Active Projects", value: "23" },
  ];

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-700">Welcome Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <span className="text-gray-500 mb-2">{stat.title}</span>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        ))}

      </div>

      {/* Additional Section Placeholder */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
        <ul className="text-gray-600 space-y-2">
          <li>New user registered</li>
          <li>Project ABC marked as completed</li>
          <li>Payment of $1,200 received</li>
        </ul>
      </div>
    </div>
  );
}