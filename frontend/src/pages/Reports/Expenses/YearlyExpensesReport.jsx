import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function YearlyExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("");

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

  // ================= AVAILABLE YEARS =================
  const years = [
    ...new Set(
      expenses.map((e) => e.expense_date?.slice(0, 4)).filter(Boolean),
    ),
  ];

  // auto select first year
  useEffect(() => {
    if (years.length && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [expenses]);

  // ================= FILTER BY YEAR =================
  const filtered = expenses.filter(
    (e) => e.expense_date?.slice(0, 4) === selectedYear,
  );

  // ================= GROUP BY MONTH =================
  const grouped = filtered.reduce((acc, item) => {
    const monthKey = item.expense_date?.slice(0, 7); // YYYY-MM

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0,
        types: new Set(),
      };
    }

    acc[monthKey].total += Number(item.expense_amount || 0);
    acc[monthKey].types.add(item.expense_type);

    return acc;
  }, {});

  const groupedArray = Object.values(grouped).map((g) => ({
    ...g,
    types: Array.from(g.types),
  }));

  // ================= TOTAL =================
  const totalAmount = groupedArray.reduce((sum, i) => sum + i.total, 0);

  // ================= FORMAT MONTH NAME =================
  const formatMonth = (m) => {
    if (!m) return "";
    return new Date(m + "-01").toLocaleString("en-US", {
      month: "long",
    });
  };

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
    pdf.save("yearly-expenses-report.pdf");
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
        {/* HEADER */}
        <ReportHeader title={`Yearly Expenses Report (${selectedYear})`} />

        {/* TABLE */}
        <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-[25%]">Month</th>
              <th className="border p-2 w-[25%]">Total Amount</th>
              <th className="border p-2 w-[50%]">Types</th>
            </tr>
          </thead>

          <tbody>
            {groupedArray.length > 0 ? (
              groupedArray.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{formatMonth(item.month)}</td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="border p-2 text-left  truncate text-wrap">
                    {item.types.join(" | ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No data for selected year
                </td>
              </tr>
            )}
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

        {/* FOOTER */}
        <div className="mt-6">
          <ReportFooter />
        </div>
      </div>
    </div>
  );
}
