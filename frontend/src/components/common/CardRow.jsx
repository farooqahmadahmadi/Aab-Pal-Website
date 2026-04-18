import React from "react";

export default function CardRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-semibold">{label}</span>
      <span className="text-right break-words max-w-[60%]">{value || "-"}</span>
    </div>
  );
}
