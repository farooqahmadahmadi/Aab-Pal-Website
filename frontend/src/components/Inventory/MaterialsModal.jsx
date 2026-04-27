import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MaterialsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const emptyForm = {
    material_name: "",
    material_unit: "",
    current_stock: 0,
    average_price: 0,
  };

  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        material_name: initialData.material_name || "",
        material_unit: initialData.material_unit || "",
        current_stock: initialData.current_stock ?? 0,
        average_price: initialData.average_price ?? 0,
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

    // 🔥 number fields convert
    if (["current_stock", "average_price"].includes(name)) {
      val = value === "" ? 0 : parseFloat(value);
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  //  Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.material_name) {
      alert("Material name required");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_material") : t("add_material")}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("name")}
            </label>
            <input
              name="material_name"
              value={form.material_name ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("unit")}
            </label>
            <select
              name="material_unit"
              value={form.material_unit ?? ""}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Unit</option>
              <option value="Meter">Meter</option>
              <option value="Squire Meter">Squire Meter</option>
              <option value="Kg">Kg</option>
              <option value="Tone">Tone</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("stock")}
            </label>
            <input
              type="number"
              name="current_stock"
              value={form.current_stock ?? 0}
              onChange={handleChange}
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("average_price")}
            </label>
            <input
              type="number"
              step="0.01"
              name="average_price"
              value={form.average_price ?? 0}
              onChange={handleChange}
              placeholder="Unit Price"
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
