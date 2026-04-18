import React from "react";

export default function MobileCard({ children, actions, id }) {
  return (
    <div className="border rounded-lg p-3 shadow-sm bg-gray-50">
      {/* Header */}
      {id && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">#{id}</span>

          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}

      {/* Body */}
      <div className="space-y-1">{children}</div>

      {/* Actions bottom (optional) */}
      {!id && actions && (
        <div className="flex justify-end gap-2 pt-2 border-t mt-4">
          {actions}
        </div>
      )}
    </div>
  );
}