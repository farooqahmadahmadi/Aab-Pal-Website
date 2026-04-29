import { useEffect, useState } from "react";
import { FiUserCheck, FiUserX, FiCoffee, FiClock } from "react-icons/fi";
import { getAttendance } from "../../../services/employeeAttendanceService";

export default function AttendanceSummaryCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await getAttendance();

      const arr =
        res?.data?.data ||
        res?.data ||
        [];

      const today = new Date().toISOString().split("T")[0];

      const todayData = Array.isArray(arr)
        ? arr.filter((a) => a.attendance_date === today)
        : [];

      setData(todayData);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  // ================= CALCULATION =================
  const present = data.filter((d) => d.attendance_status === "Present").length;
  const absent = data.filter((d) => d.attendance_status === "Absent").length;
  const leave = data.filter((d) => d.attendance_status === "Leave").length;
  const sick = data.filter((d) => d.attendance_status === "Sick").length;

  // ================= UI =================
  return (
    <div  className="relative bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-md p-4 w-full 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* glow */}
      <div className="absolute -top-10 -right-10 w-24  h-18 bg-emerald-50 rounded-full blur-2xl opacity-50"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2 relative z-10 gap-1">
        <h3 className="text-xs font-semibold text-gray-700">
          Today Attendance
        </h3>

        <span className="text-xs text-gray-500">
          {new Date().toISOString().split("T")[0]}
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-2 gap-1 relative z-10">

        {/* PRESENT */}
        <div className="bg-green-50 rounded-xl p-3 flex items-center justify-between border border-green-100">
          <div>
            <p className="text-xs text-gray-500">Present</p>
            <p className="text-lg font-bold text-green-700">{present}</p>
          </div>
          <FiUserCheck className="text-green-600 text-xl" />
        </div>

        {/* ABSENT */}
        <div className="bg-red-50 rounded-xl p-3 flex items-center justify-between border border-red-100">
          <div>
            <p className="text-xs text-gray-500">Absent</p>
            <p className="text-lg font-bold text-red-600">{absent}</p>
          </div>
          <FiUserX className="text-red-500 text-xl" />
        </div>

        {/* LEAVE */}
        <div className="bg-yellow-50 rounded-xl p-3 flex items-center justify-between border border-yellow-100">
          <div>
            <p className="text-xs text-gray-500">Leave</p>
            <p className="text-lg font-bold text-yellow-600">{leave}</p>
          </div>
          <FiCoffee className="text-yellow-600 text-xl" />
        </div>

        {/* SICK */}
        <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between border border-blue-100">
          <div>
            <p className="text-xs text-gray-500">Sick</p>
            <p className="text-lg font-bold text-blue-600">{sick}</p>
          </div>
          <FiClock className="text-blue-600 text-xl" />
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-3 text-xs text-gray-500 flex justify-between relative z-10">
        <span>Total Today</span>
        <span className="font-semibold text-gray-700">{data.length}</span>
      </div>

    </div>
  );
}