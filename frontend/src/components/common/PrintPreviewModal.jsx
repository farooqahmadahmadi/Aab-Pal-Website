import React from "react";

export default function PrintPreviewModal({
  open,
  onClose,
  onPrint,
  onDownload,
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      
      {/* MODAL BOX */}
      <div className="bg-white w-[90%] h-[90%] rounded shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="font-semibold">Print Preview</h2>

          <button
            onClick={onClose}
            className="text-red-600 font-bold"
          >
            ✕
          </button>
        </div>

        {/* PREVIEW AREA */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="scale-[0.85] origin-top">
            {children}
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="p-3 border-t flex justify-end gap-2 print:hidden">

          <button
            onClick={onDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Auto Download PDF
          </button>

          <button
            onClick={onPrint}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Print
          </button>

        </div>

      </div>
    </div>
  );
}