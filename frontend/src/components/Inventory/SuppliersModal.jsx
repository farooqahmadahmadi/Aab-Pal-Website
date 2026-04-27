import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SuppliersModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const emptyForm = {
    supplier_name: "",
    supplier_phone: "",
    supplier_email: "",
    supplier_address: "",
    supplier_status: "Active",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        supplier_name: initialData.supplier_name || "",
        supplier_phone: initialData.supplier_phone || "",
        supplier_email: initialData.supplier_email || "",
        supplier_address: initialData.supplier_address || "",
        supplier_status: initialData.supplier_status || "Active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  //  Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.supplier_name || !form.supplier_address) {
      alert("Name and Address required");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_supplier") : t("add_supplier")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("supplier_name")}
            </label>
            <input
              name="supplier_name"
              value={form.supplier_name ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("phone")}
            </label>
            <input
              name="supplier_phone"
              value={form.supplier_phone ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("email")}
            </label>
            <input
              name="supplier_email"
              value={form.supplier_email ?? ""}
              onChange={handleChange}
              type="email"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("address")}
            </label>
            <input
              name="supplier_address"
              value={form.supplier_address ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("status")}
            </label>
            <select
              name="supplier_status"
              value={form.supplier_status}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
