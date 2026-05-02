export default function AdminDashboard() {
  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        <div className="bg-white p-4 rounded shadow">
          Total Users
        </div>

        <div className="bg-white p-4 rounded shadow">
          Active Projects
        </div>

        <div className="bg-white p-4 rounded shadow">
          Revenue
        </div>

      </div>

    </div>
  );
}