import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function BoqItemModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const emptyForm = {
    project_id: "",
    item_name: "",
    unit: "Meter",
    item_quantity: "",
    unit_price: "",
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        project_id: initialData.project_id || "",
        item_name: initialData.item_name || "",
        unit: initialData.unit || "Meter",
        item_quantity: initialData.item_quantity || "",
        unit_price: initialData.unit_price || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;

    if (["project_id"].includes(name)) {
      val = value === "" ? "" : parseInt(value);
    }

    if (["item_quantity", "unit_price"].includes(name)) {
      val = value === "" ? "" : parseFloat(value);
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.project_id || !form.item_name) {
      alert("Required fields");
      return;
    }

    const payload = {
      ...form,
      project_id: Number(form.project_id),
      item_quantity: form.item_quantity ? Number(form.item_quantity) : 0,
      unit_price: form.unit_price ? Number(form.unit_price) : 0,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_boq") : t("add_boq")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* Project ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("project_id")}
            </label>
            <input
              name="project_id"
              value={form.project_id ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("name")}
            </label>
            <input
              name="item_name"
              value={form.item_name ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("unit")}
            </label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Meter">Meter</option>
              <option value="Tone">Tone</option>
              <option value="Square Meter">Square Meter</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("qty")}</label>
            <input
              name="item_quantity"
              value={form.item_quantity ?? ""}
              onChange={handleChange}
              type="number"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("price")}
            </label>
            <input
              name="unit_price"
              value={form.unit_price ?? ""}
              onChange={handleChange}
              type="number"
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
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
