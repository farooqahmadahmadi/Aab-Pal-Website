import React, { useEffect, useState } from "react";

export default function SearchBar({ value, onChange }) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="border px-3 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
