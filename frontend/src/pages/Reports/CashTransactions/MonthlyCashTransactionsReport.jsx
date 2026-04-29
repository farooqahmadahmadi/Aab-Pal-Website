import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getTransactions } from "../../../services/cashTransactionsService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyCashTransactionsReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("");

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

  // ================= MONTHS =================
  const months = [
    ...new Set(
      transactions.map((e) => e.transaction_date?.slice(0, 7)).filter(Boolean),
    ),
  ];

  // auto select first month
  useEffect(() => {
    if (months.length && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [transactions]);

  // ================= FILTER =================
  const filtered = transactions.filter(
    (e) => e.transaction_date?.slice(0, 7) === selectedMonth,
  );

  // ================= GROUP BY DATE =================
  const grouped = filtered.reduce((acc, item) => {
    const date = item.transaction_date;

    if (!acc[date]) {
      acc[date] = {
        date,
        income: 0,
        expense: 0,
      };
    }

    if (item.transaction_type === "Income") {
      acc[date].income += Number(item.amount || 0);
    } else {
      acc[date].expense += Number(item.amount || 0);
    }

    return acc;
  }, {});

  const groupedArray = Object.values(grouped).map((d) => ({
    ...d,
    profit: d.income - d.expense,
  }));

  // 🔥 SORT BY DATE
  groupedArray.sort((a, b) => new Date(a.date) - new Date(b.date));

  // ================= TOTAL =================
  const totalIncome = groupedArray.reduce((s, i) => s + i.income, 0);
  const totalExpense = groupedArray.reduce((s, i) => s + i.expense, 0);
  const totalProfit = totalIncome - totalExpense;

  // ================= TITLE =================
  const monthName = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const title = `Monthly Transactions Report (${monthName})`;

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
    pdf.save("monthly-cash-transactions-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* FILTER */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
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

      {/* REPORT */}
      <div className="pdf-page w-full max-w-[210mm] bg-white p-4">
        <ReportHeader title={title} />

        <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-[25%]">Date</th>
              <th className="border p-2 w-[25%]">Income</th>
              <th className="border p-2 w-[25%]">Expense</th>
              <th className="border p-2 w-[25%]">Profit</th>
            </tr>
          </thead>

          <tbody>
            {groupedArray.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{item.date}</td>
                <td className="border p-2 text-green-600 font-semibold">
                  {item.income.toFixed(2)}
                </td>
                <td className="border p-2 text-red-600 font-semibold">
                  {item.expense.toFixed(2)}
                </td>
                <td className="border p-2 font-bold">
                  {item.profit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td className="border p-2 text-cneter">Total</td>
              <td className="border p-2 text-green-700">
                {totalIncome.toFixed(2)}
              </td>
              <td className="border p-2 text-red-700">
                {totalExpense.toFixed(2)}
              </td>
              <td className="border p-2">{totalProfit.toFixed(2)}</td>
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
