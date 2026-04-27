import React, { useEffect, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ClientInfoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    client_name: "",
    client_nid_number: "",
    client_phone: "",
    client_email: "",
    client_address: "",
    client_photo: null,
    client_status: "",
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, client_photo: null });
    } else {
      setForm({
        client_name: "",
        client_nid_number: "",
        client_phone: "",
        client_email: "",
        client_address: "",
        client_photo: null,
        client_status: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_client") : t("add_client")}
        </h2>

        {/* FORM */}
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {t("name")}
              </label>
              <input
                name="client_name"
                value={form.client_name || ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* NID */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {t("nid")}
              </label>
              <input
                name="client_nid_number"
                value={form.client_nid_number || ""}
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
                name="client_phone"
                value={form.client_phone || ""}
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
                name="client_email"
                value={form.client_email || ""}
                onChange={handleChange}
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
                name="client_address"
                value={form.client_address || ""}
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
                name="client_status"
                value={form.client_status || ""}
                onChange={handleChange}
                className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>

            {/* FILE */}
            <div className="md:col-span-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("photo")}
                </label>

                <label className="flex items-center justify-between gap-2 border p-2.5 rounded cursor-pointer hover:bg-gray-50">
                  <span className="text-sm text-gray-600 truncate">
                    {form.client_photo
                      ? form.client_photo.name
                      : "Select a file..."}
                  </span>

                  <input
                    type="file"
                    name="client_photo"
                    onChange={handleChange}
                    className="hidden"
                    accept=".png,.jpeg,.jpg,.svg"
                  />

                  <FiPaperclip className="text-green-500" size={20} />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
              >
                {initialData ? t("update") : t("save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
