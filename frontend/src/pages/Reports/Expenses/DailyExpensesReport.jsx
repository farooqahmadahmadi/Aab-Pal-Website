import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DailyExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

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

  // 🔥 FILTER BY DATE
  const filteredExpenses = expenses.filter(
    (item) => item.expense_date === selectedDate,
  );

  // 🔥 SORT BY ID
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => a.expense_id - b.expense_id,
  );

  // 🔥 TOTAL
  const totalAmount = sortedExpenses.reduce(
    (sum, item) => sum + Number(item.expense_amount || 0),
    0,
  );

  // ================= PAGINATION =================
  const A4_HEIGHT = 297;
  const RESERVED_SPACE = 8;
  const ROW_HEIGHT = 10;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < sortedExpenses.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(sortedExpenses.slice(i, i + MAX_ROWS_PER_PAGE));
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

    pdf.save("daily-expenses-report.pdf");
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
        {/* 🔥 EMPTY STATE (IMPORTANT FIX) */}
        {sortedExpenses.length === 0 ? (
          <div className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4">
            <ReportHeader title={`Daily Expenses - ${selectedDate}`} />

            <div className="text-center py-10 text-gray-500">
              No expenses found for this date
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
              {/* HEADER */}
              {pageIndex === 0 && (
                <ReportHeader title={`Daily Expenses - ${selectedDate}`} />
              )}

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
        )}
      </div>
    </div>
  );
}
