import React from "react";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";
export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex gap-1 justify-center mt-4 text-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center px-3 gap-1 py-1 border rounded-full disabled:opacity-50 hover:bg-gray-100 hover:text-blue-600 shadow-md"
      >
        <FaRegArrowAltCircleLeft />
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${p === page ? "bg-blue-500 text-white" : ""}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center px-3 gap-1 py-1 border rounded-full disabled:opacity-50 hover:bg-gray-100 hover:text-blue-600 shadow-md "
      >
        Next
        <FaRegArrowAltCircleRight />
      </button>
    </div>
  );
}
