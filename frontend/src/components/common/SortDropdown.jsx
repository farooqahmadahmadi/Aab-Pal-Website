import React from "react";

export default function SortDropdown({ sortField, sortOrder, onChange }) {

    const handleChange = (e) => {
        const [field, order] = e.target.value.split("-");
        onChange(field, order);
    };

    return (
        <select
            value={`${sortField}-${sortOrder}`}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
        >
            <option value="document_id-asc">ID ↑</option>
            <option value="document_id-desc">ID ↓</option>
            <option value="doc_name-asc">Name ↑</option>
            <option value="doc_name-desc">Name ↓</option>
        </select>
    );
}