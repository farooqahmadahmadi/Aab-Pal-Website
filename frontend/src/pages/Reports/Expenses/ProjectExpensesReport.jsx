import React, { useEffect, useState } from "react";
import ReportHeader from "../../../components/common/ReportHeader";
import ReportFooter from "../../../components/common/ReportFooter";
import { getExpenses } from "../../../services/expensesService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectExpensesReport() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState("");

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

  // ================= UNIQUE PROJECT IDs =================
  const projectIds = [
    ...new Set(expenses.map((e) => e.project_id).filter(Boolean)),
  ];

  // ================= FILTER =================
  const filtered = selectedProject
    ? expenses.filter((e) => String(e.project_id) === String(selectedProject))
    : expenses;
  // ================= GROUP BY TYPE =================
  const grouped = filtered.reduce((acc, item) => {
    const key = item.expense_type;

    if (!acc[key]) {
      acc[key] = {
        type: item.expense_type,
        total: 0,
        descriptions: [],
      };
    }

    acc[key].total += Number(item.expense_amount || 0);
    acc[key].descriptions.push(item.expense_description || "-");

    return acc;
  }, {});

  const groupedArray = Object.values(grouped);

  // ================= TOTAL =================
  const totalAmount = groupedArray.reduce((sum, i) => sum + i.total, 0);

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
    pdf.save("project-expenses-report.pdf");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-100 p-3 flex flex-col items-center">
      {/* ================= FILTER ================= */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">Select Project</option>
          {projectIds.map((id) => (
            <option key={id} value={id}>
              Project {id}
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
        <ReportHeader
          title={`Project Expenses Report (${selectedProject || "All"})`}
        />

        {/* TABLE */}
        <table className="w-full text-xs border border-gray-300 border-collapse mt-3 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 w-[25%]">Type</th>
              <th className="border p-2 w-[25%]">Total Amount</th>
              <th className="border p-2 w-[50%]">Description</th>
            </tr>
          </thead>

          <tbody>
            {groupedArray.length > 0 ? (
              groupedArray.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{item.type}</td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="border p-2 text-left truncate text-wrap">
                    {item.descriptions.join(" | ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No data for selected project
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
