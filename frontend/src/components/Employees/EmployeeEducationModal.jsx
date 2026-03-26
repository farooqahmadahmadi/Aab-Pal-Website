import React, { useEffect, useState } from "react";

export default function EmployeeEducationModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    employee_id: "",
    educational_degree: "",
    educational_institution: "",
    educational_field: "",
    graduation_date: "",
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        graduation_date: initialData.graduation_date || ""
      });
    } else {
      setForm({
        employee_id: "",
        educational_degree: "",
        educational_institution: "",
        educational_field: "",
        graduation_date: "",
        description: ""
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const submit = (e) => {
    e.preventDefault();

    const cleanedForm = {
      ...form,
      graduation_date: form.graduation_date || null
    };

    onSubmit(cleanedForm);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">

        {/* Heading */}
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Update Employee Education" : "Add New Employee Education"}
        </h3>

        <form onSubmit={submit} className="space-y-3">

          <input
            type="number"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="Employee ID"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="educational_degree"
            value={form.educational_degree}
            onChange={handleChange}
            placeholder="Degree"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="educational_institution"
            value={form.educational_institution}
            onChange={handleChange}
            placeholder="Institution Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="educational_field"
            value={form.educational_field}
            onChange={handleChange}
            placeholder="Field of Study"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="graduation_date"
            value={form.graduation_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Additional Notes"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}