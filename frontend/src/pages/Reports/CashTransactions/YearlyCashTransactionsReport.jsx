import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getTransactions } from "../../../services/cashTransactionsService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function YearlyCashTransactionsReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("");

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

  // ================= YEARS =================
  const years = [
    ...new Set(
      transactions.map((e) => e.transaction_date?.slice(0, 4)).filter(Boolean),
    ),
  ];

  useEffect(() => {
    if (years.length && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [transactions]);

  // ================= MONTH NAMES =================
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ================= DATA PROCESS =================
  let groupedArray = [];

  if (selectedYear) {
    const filtered = transactions.filter(
      (e) => e.transaction_date?.slice(0, 4) === selectedYear,
    );

    const grouped = {};

    filtered.forEach((item) => {
      const monthIndex = new Date(item.transaction_date).getMonth();

      if (!grouped[monthIndex]) {
        grouped[monthIndex] = {
          month: monthNames[monthIndex],
          income: 0,
          expense: 0,
        };
      }

      if (item.transaction_type === "Income") {
        grouped[monthIndex].income += Number(item.amount || 0);
      } else {
        grouped[monthIndex].expense += Number(item.amount || 0);
      }
    });

    // 🔥 ensure all 12 months موجود وي
    groupedArray = monthNames.map((month, index) => {
      const data = grouped[index] || {
        month,
        income: 0,
        expense: 0,
      };

      return {
        ...data,
        profit: data.income - data.expense,
      };
    });
  }

  // ================= TOTAL =================
  const totalIncome = groupedArray.reduce((s, i) => s + i.income, 0);
  const totalExpense = groupedArray.reduce((s, i) => s + i.expense, 0);
  const totalProfit = totalIncome - totalExpense;

  // ================= TITLE =================
  const title = selectedYear
    ? `Yearly Cash Transactions Report (${selectedYear})`
    : "Yearly Report";

  // ================= PDF =================
  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    await new Promise((r) => setTimeout(r, 300));

    const page = document.querySelector(".pdf-page");

    const canvas = await html2canvas(page, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: page.offsetWidth,
      windowHeight: page.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(pdfHeight, 285));
    pdf.save("yearly-cash-transactions-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* ================= FILTER ================= */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={handleExportPDF}
          className="bg-sky-500 text-white px-3 py-1 rounded animate-bounce"
        >
          Export PDF
        </button>
      </div>

      {/* ================= REPORT ================= */}
      <div className="pdf-page w-full max-w-[210mm] bg-white p-4">
        <ReportHeader title={title} />

        <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-[25%]">Month</th>
              <th className="border p-2 w-[25%]">Income</th>
              <th className="border p-2 w-[25%]">Expense</th>
              <th className="border p-2 w-[25%]">Profit</th>
            </tr>
          </thead>

          <tbody>
            {groupedArray.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{item.month}</td>
                <td className="border p-2 text-green-600 font-semibold">
                  {item.income.toFixed(2)}
                </td>
                <td className="border p-2 text-red-600 font-semibold">
                  {item.expense.toFixed(2)}
                </td>
                <td className="border p-2 text-blue-600 font-semibold">
                  {item.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td className="border p-2 text-center">Total</td>
              <td className="border p-2 text-green-700">
                {totalIncome.toFixed(2)}
              </td>
              <td className="border p-2 text-red-700">
                {totalExpense.toFixed(2)}
              </td>
              <td className="border p-2 text-blue-700">
                {totalProfit.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-6">
          <ReportFooter />
        </div>
      </div>
    </div>
  );
}
