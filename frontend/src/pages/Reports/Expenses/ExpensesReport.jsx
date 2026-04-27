import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 🔥 SORT BY ID (STABLE)
  const sortedExpenses = [...expenses].sort(
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
  const ROW_HEIGHT = 10.5;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < sortedExpenses.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(sortedExpenses.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  // ================= PDF EXPORT (FINAL STABLE) =================
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

      // 🔥 CRITICAL FIX (THIS SOLVES LOGO STRETCH)
      windowWidth: element.offsetWidth,
      windowHeight: element.scrollHeight,

      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = 210; // A4 width
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const maxHeight = 285;

    const finalHeight = Math.min(pdfHeight, maxHeight);

    if (i > 0) pdf.addPage();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
  }

  pdf.save("expenses-report.pdf");
};

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* EXPORT BUTTON */}
      <div className="flex gap-2">
        <button
          onClick={handleExportPDF}
          className="mb-3 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* REPORT ROOT */}
      <div id="report-root" className="flex flex-col items-center w-full">
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="pdf-page w-full max-w-[210mm] mx-auto bg-white p-4 overflow-hidden"
            style={{
              minHeight: "297mm",
              boxSizing: "border-box",
              marginBottom: "8mm",
            }}
          >
            {/* HEADER */}
            <div className="report-header w-full bg-white h-auto">
            <ReportHeader title="All Expenses" />
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

              {/* TOTAL ONLY LAST PAGE */}
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

            {/* FOOTER ONLY LAST PAGE */}
            {pageIndex === pages.length - 1 && (
              <div className="mt-6">
                <ReportFooter />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
