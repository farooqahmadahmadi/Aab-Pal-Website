import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AttendanceShiftModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    shift_name: "",
    check_in_start: "",
    check_in_end: "",
    check_out_start: "",
    check_out_end: "",
    latitude: "",
    longitude: "",
    reduce: 10,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_shift") : t("add_shift")}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* SHIFT NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("shift_name")}
            </label>
            <input
              name="shift_name"
              value={form.shift_name}
              onChange={handleChange}
              className="border p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* TIME SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">
                {t("check_in_start")}
              </label>
              <input
                type="time"
                name="check_in_start"
                value={form.check_in_start}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t("check_in_end")}</label>
              <input
                type="time"
                name="check_in_end"
                value={form.check_in_end}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                {t("check_out_start")}
              </label>
              <input
                type="time"
                name="check_out_start"
                value={form.check_out_start}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t("check_out_end")}</label>
              <input
                type="time"
                name="check_out_end"
                value={form.check_out_end}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">{t("latitude")}</label>
              <input
                type="number"
                step="0.0000001"
                name="latitude"
                value={form.latitude ?? 0}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t("longitude")}</label>
              <input
                type="number"
                step="0.0000001"
                name="longitude"
                value={form.longitude ?? 0}
                onChange={handleChange}
                className="border p-2.5 rounded w-full"
                required
              />
            </div>
          </div>

          {/* REDUCE */}
          <div>
            <label className="block text-sm mb-1">{t("reduce")}</label>
            <input
              type="number"
              name="reduce"
              value={form.reduce}
              onChange={handleChange}
              className="border p-2.5 rounded w-full"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
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
