import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getTransactions } from "../../../services/cashTransactionsService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CashTransactionsFilteredReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportType, setReportType] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const filteredTransactions = transactions.filter((item) => {
    if (!item.transaction_date) return false;
    return item.transaction_date >= fromDate && item.transaction_date <= toDate;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => a.transaction_id - b.transaction_id,
  );

  // ================= TOTALS =================
  const totalIncome = sortedTransactions
    .filter((item) => item.transaction_type === "Income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpense = sortedTransactions
    .filter((item) => item.transaction_type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const profit = totalIncome - totalExpense;

  // ================= PAGINATION =================
  const A4_HEIGHT = 297;
  const RESERVED_SPACE = 8;
  const ROW_HEIGHT = 10.5;

  const MAX_ROWS_PER_PAGE = Math.floor(
    (A4_HEIGHT - RESERVED_SPACE) / ROW_HEIGHT,
  );

  const pages = [];
  for (let i = 0; i < sortedTransactions.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(sortedTransactions.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  // ================= TITLE =================
  const getReportTitle = () => {
    const typeText =
      reportType === "all"
        ? "All Transactions"
        : reportType === "daily"
          ? "Daily Transactions"
          : "Transactions Report";

    return `${typeText} (${fromDate} → ${toDate})`;
  };

  // ================= PDF =================
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

    pdf.save("filtered-cash-transactions-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* FILTER */}
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
          <option value="all">All Transactions</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="annual">Annual</option>
          <option value="custom">Custom</option>
        </select>

        <button
          onClick={handleExportPDF}
          className="bg-sky-500 text-white px-3 py-1 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* REPORT */}
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
              <div className="report-header w-full bg-white">
                <ReportHeader title={getReportTitle()} />
              </div>

              {/* TABLE */}
              <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 w-[10%]">ID</th>
                    <th className="border p-2 w-[20%]">Ref Type</th>
                    <th className="border p-2 w-[15%]">Type</th>
                    <th className="border p-2 w-[15%]">Amount</th>
                    <th className="border p-2 w-[20%]">Date</th>
                    <th className="border p-2 w-[20%]">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {page.map((item) => (
                    <tr
                      key={item.transaction_id}
                      className="text-center h-[40px]"
                    >
                      <td className="border p-2">{item.transaction_id}</td>
                      <td className="border p-2">{item.reference_type}</td>
                      <td
                        className={`border p-2 font-semibold ${
                          item.transaction_type === "Income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.transaction_type}
                      </td>
                      <td className="border p-2">{item.amount}</td>
                      <td className="border p-2">{item.transaction_date}</td>
                      <td className="border p-2 text-left truncate text-wrap">
                        {item.transaction_description}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* TOTAL */}
                {pageIndex === pages.length - 1 && (
                  <tfoot className="bg-gray-100 font-bold">
                    <tr>
                      <td colSpan="1" className="border p-2 text-right">
                        Income
                      </td>
                      <td colSpan="1" className="border p-2 text-green-600">
                        {totalIncome.toFixed(2)}
                      </td>

                      <td className="border p-2 text-right">Expense</td>
                      <td className="border p-2 text-red-600">
                        {totalExpense.toFixed(2)}
                      </td>

                      <td colSpan="1" className="border p-2 text-right">
                        Profit
                      </td>
                      <td
                        colSpan="1"
                        className={`border p-2 ${
                          profit >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {profit.toFixed(2)}
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
