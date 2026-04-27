import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExpensesFilteredReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📅 default = today
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportType, setReportType] = useState("all");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const filteredExpenses = expenses.filter((item) => {
    if (!item.expense_date) return false;

    const date = item.expense_date;
    return date >= fromDate && date <= toDate;
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => a.expense_id - b.expense_id,
  );

  // ================= TOTAL =================
  const totalAmount = sortedExpenses.reduce(
    (sum, item) => sum + Number(item.expense_amount || 0),
    0,
  );

  // ================= PAGINATION =================
  const A4_HEIGHT = 297;
  const RESERVED_SPACE = 8;
  const ROW_HEIGHT = 10.5;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < sortedExpenses.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(sortedExpenses.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  // ================= TITLE (ONLY ADDITION) =================
  const getReportTitle = () => {
    const typeText =
      reportType === "all"
        ? "All Expenses"
        : reportType === "daily"
          ? "Daily Expenses"
          : "Expenses Report";

    return `${typeText} (${fromDate} → ${toDate})`;
  };

  // ================= PDF EXPORT =================
  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    await new Promise((r) => setTimeout(r, 300));

    const pageElements = document.querySelectorAll(".pdf-page");

    for (let i = 0; i < pageElements.length; i++) {
      const element = pageElements[i];

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: element.offsetWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const finalHeight = Math.min(pdfHeight, 285);

      if (i > 0) pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
    }

    pdf.save("filtered-expenses-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* ================= FILTER UI ================= */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Expenses</option>
          <option value="daily">Daily</option>
          <option value="daily">Weekly</option>
          <option value="daily">Annual</option>
          <option value="daily">Custom</option>
        </select>

        <button
          onClick={handleExportPDF}
          className="bg-sky-500 text-white px-3 py-1 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* ================= REPORT ================= */}
      <div id="report-root" className="flex flex-col items-center w-full">
        {pages.length > 0 ? (
          pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4 overflow-hidden"
              style={{
                minHeight: "297mm",
                boxSizing: "border-box",
                marginBottom: "8mm",
              }}
            >
              {/* HEADER (ONLY CHANGE HERE) */}
              <div className="report-header w-full bg-white">
                <ReportHeader title={getReportTitle()} />
              </div>

              {/* TABLE */}
              <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 w-[10%]">ID</th>
                    <th className="border p-2 w-[20%]">Type</th>
                    <th className="border p-2 w-[15%]">Amount</th>
                    <th className="border p-2 w-[20%]">Date</th>
                    <th className="border p-2 w-[35%]">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {page.map((item) => (
                    <tr key={item.expense_id} className="text-center h-[40px]">
                      <td className="border p-2">{item.expense_id}</td>
                      <td className="border p-2">{item.expense_type}</td>
                      <td className="border p-2 text-red-600 font-semibold">
                        {item.expense_amount}
                      </td>
                      <td className="border p-2">{item.expense_date}</td>
                      <td className="border p-2 text-left truncate text-wrap">
                        {item.expense_description}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* TOTAL */}
                {pageIndex === pages.length - 1 && (
                  <tfoot className="bg-gray-100 font-bold">
                    <tr>
                      <td colSpan="3" className="border p-2 text-right">
                        Total
                      </td>
                      <td colSpan="2" className="border p-2 text-red-700">
                        {totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>

              {/* FOOTER */}
              {pageIndex === pages.length - 1 && (
                <div className="mt-6">
                  <ReportFooter />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 text-gray-500">
            No data found for selected range
          </div>
        )}
      </div>
    </div>
  );
}
