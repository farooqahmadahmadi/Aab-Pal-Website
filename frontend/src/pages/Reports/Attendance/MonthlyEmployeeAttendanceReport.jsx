import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getAttendance } from "../../../services/employeeAttendanceService";
import EmployeeService from "../../../services/employeeService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyEmployeeAttendanceReport() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

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

  // ✅ GET EMP NAME
  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.employee_id === id);
    return emp?.emp_full_name || "N/A";
  };

  // 🔥 FILTER BY MONTH
  const filteredAttendance = attendance.filter((item) =>
    item.attendance_date?.startsWith(selectedMonth),
  );

  // 🔥 GROUP BY EMPLOYEE
  const grouped = {};

  filteredAttendance.forEach((item) => {
    const empId = item.employee_id;

    if (!grouped[empId]) {
      grouped[empId] = {
        employee_id: empId,
        present: 0,
        absent: 0,
        leave: 0,
        sick: 0,
      };
    }

    switch (item.attendance_status) {
      case "Present":
        grouped[empId].present++;
        break;
      case "Absent":
        grouped[empId].absent++;
        break;
      case "Leave":
        grouped[empId].leave++;
        break;
      case "Sick":
        grouped[empId].sick++;
        break;
      default:
        break;
    }
  });

  const finalData = Object.values(grouped).sort(
    (a, b) => a.employee_id - b.employee_id,
  );

  // ================= PAGINATION =================
  const A4_HEIGHT = 297;
  const RESERVED_SPACE = 8;
  const ROW_HEIGHT = 10;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < finalData.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(finalData.slice(i, i + MAX_ROWS_PER_PAGE));
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

    pdf.save("monthly-attendance-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* MONTH PICKER */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleExportPDF}
          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* REPORT ROOT */}
      <div id="report-root" className="flex flex-col items-center w-full">
        {finalData.length === 0 ? (
          <div className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4">
            <ReportHeader title={`Monthly Attendance - ${selectedMonth}`} />

            <div className="text-center py-10 text-gray-500">
              No attendance data found
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
                <ReportHeader title={`Monthly Attendance - ${selectedMonth}`} />
              )}

              {/* TABLE */}
              <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 w-[10%]">Emp ID</th>
                    <th className="border p-2 w-[25%]">Name</th>
                    <th className="border p-2 w-[15%]">Present</th>
                    <th className="border p-2 w-[15%]">Absent</th>
                    <th className="border p-2 w-[15%]">Leave</th>
                    <th className="border p-2 w-[15%]">Sick</th>
                  </tr>
                </thead>

                <tbody>
                  {page.map((item, i) => (
                    <tr key={i} className="text-center h-[40px]">
                      <td className="border p-2">{item.employee_id}</td>
                      <td className="border p-2 text-left">
                        {getEmployeeName(item.employee_id)}
                      </td>
                      <td className="border p-2 text-green-600 font-semibold">
                        {item.present}
                      </td>
                      <td className="border p-2 text-red-600 font-semibold">
                        {item.absent}
                      </td>
                      <td className="border p-2 text-yellow-600 font-semibold">
                        {item.leave}
                      </td>
                      <td className="border p-2 text-blue-600 font-semibold">
                        {item.sick}
                      </td>
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
