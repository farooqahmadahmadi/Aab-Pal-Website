import React, { useEffect, useState } from "react";

const emptyForm = {
  emp_full_name: "",
  emp_father_name: "",
  emp_dob: "",
  emp_nid_number: "",
  emp_gender: "",
  emp_marital_status: "",
  emp_phone: "",
  emp_email: "",
  emp_permanent_address: "",
  emp_current_address: "",
  emp_bank_account: "",
};

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        emp_full_name: initialData.emp_full_name || "",
        emp_father_name: initialData.emp_father_name || "",
        emp_dob: initialData.emp_dob || "",
        emp_nid_number: initialData.emp_nid_number || "",
        emp_gender: initialData.emp_gender || "",
        emp_marital_status: initialData.emp_marital_status || "",
        emp_phone: initialData.emp_phone || "",
        emp_email: initialData.emp_email || "",
        emp_permanent_address: initialData.emp_permanent_address || "",
        emp_current_address: initialData.emp_current_address || "",
        emp_bank_account: initialData.emp_bank_account || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 max-h-[90%] overflow-auto">
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Edit Employee" : "Add Employee"}
        </h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            name="emp_full_name"
            value={form.emp_full_name || ""}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="emp_father_name"
            value={form.emp_father_name || ""}
            onChange={handleChange}
            placeholder="Father Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="emp_dob"
            value={form.emp_dob || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="emp_nid_number"
            value={form.emp_nid_number || ""}
            onChange={handleChange}
            placeholder="NID Number"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="emp_gender"
            value={form.emp_gender || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="emp_marital_status"
            value={form.emp_marital_status || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="emp_phone"
            value={form.emp_phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />

          <input
            name="emp_email"
            value={form.emp_email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <input
            name="emp_permanent_address"
            value={form.emp_permanent_address || ""}
            onChange={handleChange}
            placeholder="Permanent Address"
            className="w-full border p-2 rounded"
          />

          <input
            name="emp_current_address"
            value={form.emp_current_address || ""}
            onChange={handleChange}
            placeholder="Current Address"
            className="w-full border p-2 rounded"
          />

          <input
            name="emp_bank_account"
            value={form.emp_bank_account || ""}
            onChange={handleChange}
            placeholder="Bank Account"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
