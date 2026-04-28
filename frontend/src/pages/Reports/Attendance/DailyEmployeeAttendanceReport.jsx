import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getAttendance } from "../../../services/employeeAttendanceService";
import EmployeeService from "../../../services/employeeService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DailyEmployeeAttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attRes, empRes] = await Promise.all([
        getAttendance(),
        EmployeeService.getAll(),
      ]);

      setAttendance(attRes.data || []);
      setEmployees(empRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET EMPLOYEE NAME
  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.employee_id === id);
    return emp?.emp_full_name || "N/A";
  };

  // 🔥 FILTER BY DATE
  const filteredAttendance = attendance.filter(
    (item) => item.attendance_date === selectedDate,
  );

  // 🔥 SORT BY ID
  const sortedAttendance = [...filteredAttendance].sort(
    (a, b) => a.emp_attendance_id - b.emp_attendance_id,
  );

  // ================= PAGINATION =================
  const A4_HEIGHT = 297;
  const RESERVED_SPACE = 8;
  const ROW_HEIGHT = 10;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < sortedAttendance.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(sortedAttendance.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  // ================= PDF EXPORT =================
  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    await new Promise((r) => setTimeout(r, 300));

    const pageElements = document.querySelectorAll(".pdf-page");

    for (let i = 0; i < pageElements.length; i++) {
      const canvas = await html2canvas(pageElements[i], {
        scale: 1.8,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.body.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 200;
      const calculatedHeight = (canvas.height * imgWidth) / canvas.width;
      const maxHeight = 285;

      const imgHeight = Math.min(calculatedHeight, maxHeight);

      if (i > 0) pdf.addPage();

      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
    }

    pdf.save("daily-attendance-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* DATE PICKER */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <div className="mb-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* EXPORT BUTTON */}
        <button
          onClick={handleExportPDF}
          className="mb-3 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* REPORT ROOT */}
      <div id="report-root" className="flex flex-col items-center w-full">
        {sortedAttendance.length === 0 ? (
          <div className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4">
            <ReportHeader title={`Daily Attendance - ${selectedDate}`} />

            <div className="text-center py-10 text-gray-500">
              No attendance found for this date
            </div>

            <ReportFooter />
          </div>
        ) : (
          pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4"
              style={{
                minHeight: "297mm",
                boxSizing: "border-box",
                marginBottom: "8mm",
              }}
            >
              {pageIndex === 0 && (
                <ReportHeader title={`Daily Attendance - ${selectedDate}`} />
              )}

              {/* TABLE */}
              <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 w-[8%]">ID</th>
                    <th className="border p-2 w-[10%]">Emp ID</th>
                    <th className="border p-2 w-[17%]">Name</th> {/* ✅ NEW */}
                    <th className="border p-2 w-[12%]">Status</th>
                    <th className="border p-2 w-[13%]">Check In</th>
                    <th className="border p-2 w-[13%]">Check Out</th>
                    <th className="border p-2 w-[12%]">Hours</th>
                    <th className="border p-2 w-[15%]">Type</th>
                  </tr>
                </thead>

                <tbody>
                  {page.map((item) => (
                    <tr
                      key={item.emp_attendance_id}
                      className="text-center h-[40px]"
                    >
                      <td className="border p-2">{item.emp_attendance_id}</td>
                      <td className="border p-2">{item.employee_id}</td>
                      <td className="border p-2 text-left">
                        {getEmployeeName(item.employee_id)}
                      </td>
                      <td className="border p-2 font-semibold">
                        {item.attendance_status}
                      </td>
                      <td className="border p-2">
                        {item.check_in_time || "-"}
                      </td>
                      <td className="border p-2">
                        {item.check_out_time || "-"}
                      </td>
                      <td className="border p-2">
                        {item.total_work_hours || 0}
                      </td>
                      <td className="border p-2">{item.attendance_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pageIndex === pages.length - 1 && (
                <div className="mt-6">
                  <ReportFooter />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
