import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("");

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

  // ================= MONTHS =================
  const months = [
    ...new Set(
      expenses.map((e) => e.expense_date?.slice(0, 7)).filter(Boolean)
    ),
  ];

  // ================= TYPES =================
  const types = [
    ...new Set(expenses.map((e) => e.expense_type).filter(Boolean)),
  ];

  // auto select first month
  useEffect(() => {
    if (months.length && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [expenses]);

  // ================= MODE SWITCH =================
  const isMonthMode = selectedMonth && !selectedType;
  const isTypeMode = selectedType && !selectedMonth;

  // ================= DATA PROCESS =================
  let groupedArray = [];

  if (isMonthMode) {
    const filtered = expenses.filter(
      (e) => e.expense_date?.slice(0, 7) === selectedMonth
    );

    const grouped = filtered.reduce((acc, item) => {
      const key = item.expense_type;

      if (!acc[key]) {
        acc[key] = {
          label: item.expense_type,
          total: 0,
          descriptions: [],
        };
      }

      acc[key].total += Number(item.expense_amount || 0);
      acc[key].descriptions.push(item.expense_description || "-");

      return acc;
    }, {});

    groupedArray = Object.values(grouped);
  }

  if (isTypeMode) {
    const filtered = expenses.filter(
      (e) => e.expense_type === selectedType
    );

    const grouped = filtered.reduce((acc, item) => {
      const key = item.expense_date?.slice(0, 7);

      if (!acc[key]) {
        acc[key] = {
          label: key,
          total: 0,
          descriptions: [],
        };
      }

      acc[key].total += Number(item.expense_amount || 0);
      acc[key].descriptions.push(item.expense_description || "-");

      return acc;
    }, {});

    groupedArray = Object.values(grouped);
  }

  // ================= TOTAL =================
  const totalAmount = groupedArray.reduce(
    (sum, i) => sum + i.total,
    0
  );

  // ================= TITLE =================
  const monthName = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const title = isMonthMode
    ? `Monthly Expenses Report (${monthName})`
    : isTypeMode
    ? `Type Report (${selectedType})`
    : "Expenses Report";

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
    pdf.save("monthly-expenses-report.pdf");
  };

  if (loading)
    return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">

      {/* ================= FILTER ================= */}
      <div className="flex gap-2 mb-3">

        {/* MONTH */}
        <select
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedType(""); // 🔥 reset
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setSelectedMonth(""); // 🔥 reset
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="">Select Type</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
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
              <th className="border p-2 w-[25%]">
                {isMonthMode ? "Type" : "Month"}
              </th>
              <th className="border p-2 w-[25%]">Total Amount</th>
              <th className="border p-2 w-[50%]">Description</th>
            </tr>
          </thead>

          <tbody>
            {groupedArray.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{item.label}</td>
                <td className="border p-2 text-red-600 font-semibold">
                  {item.total.toFixed(2)}
                </td>
                <td className="border p-2 text-left  truncate text-wrap">
                  {item.descriptions.join(" | ")}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td className="border p-2 text-right">Total</td>
              <td colSpan="2" className="border p-2 text-red-700">
                {totalAmount.toFixed(2)}
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