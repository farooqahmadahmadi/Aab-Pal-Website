import { useEffect, useState } from "react";
import { getAttendance } from "../services/attendanceService";
import Pagination from "../components/common/Pagination";
import SearchBar from "../components/common/SearchBar";

export default function AttendanceList() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        getAttendance().then(res => {
            setData(res.data);
            setFiltered(res.data);
        });
    }, []);

    useEffect(() => {
        const f = data.filter(d =>
            d.employee_id.toString().includes(search)
        );
        setFiltered(f);
    }, [search, data]);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return (
        <div className="p-6">
            <SearchBar value={search} onChange={setSearch} />

            <table className="w-full mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(r => (
                        <tr key={r.emp_attendance_id}>
                            <td>{r.employee_id}</td>
                            <td>
                                <span className={`px-2 py-1 rounded ${r.attendance_status === "Present"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}>
                                    {r.attendance_status}
                                </span>
                            </td>
                            <td>{r.check_in_time}</td>
                            <td>{r.check_out_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                page={page}
                total={filtered.length}
                limit={limit}
                onPageChange={setPage}
            />
        </div>
    );
}