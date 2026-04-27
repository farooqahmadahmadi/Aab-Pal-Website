import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function EquipmentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const defaultForm = {
    equip_name: "",
    equip_company: "",
    equip_serial_number: "",
    equip_purchase_date: "",
    equip_purchase_price: "",
    equip_current_status: "NotUsed",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault(); // ✅ prevent reload
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_equipment") : t("add_equipment")}
        </h2>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("equipment")}
            </label>
            <input
              name="equip_name"
              value={form.equip_name || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("company")}
            </label>
            <input
              name="equip_company"
              value={form.equip_company || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Serial */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("serial_number")}
            </label>
            <input
              name="equip_serial_number"
              value={form.equip_serial_number || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("purchase_date")}
            </label>
            <input
              type="date"
              name="equip_purchase_date"
              value={form.equip_purchase_date || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("purchase_price")}
            </label>
            <input
              type="number"
              name="equip_purchase_price"
              value={form.equip_purchase_price || ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("status")}
            </label>
            <select
              name="equip_current_status"
              value={form.equip_current_status}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="NotUsed">Not Used</option>
              <option value="InUse">In Use</option>
              <option value="Damaged">Damaged</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {initialData ? t("update") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
