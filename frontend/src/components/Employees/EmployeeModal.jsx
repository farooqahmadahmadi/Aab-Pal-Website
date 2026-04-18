import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">

      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-5">

        {/* TITLE */}
        <h3 className="text-xl font-bold mb-5 text-center">
          {initialData ? t("edit_employee") : t("add_employee")}
        </h3>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >

          {/* FULL NAME */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">
              {t("full_name")}
            </label>
            <input
              name="emp_full_name"
              value={form.emp_full_name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* FATHER NAME */}
          <div>
            <label className="text-sm font-medium">
              {t("father_name")}
            </label>
            <input
              name="emp_father_name"
              value={form.emp_father_name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-medium">
              {t("emp_dob")}
            </label>
            <input
              type="date"
              name="emp_dob"
              value={form.emp_dob}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* NID */}
          <div>
            <label className="text-sm font-medium">
              {t("emp_nid_number")}
            </label>
            <input
              name="emp_nid_number"
              value={form.emp_nid_number}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="text-sm font-medium">
              {t("gender")}
            </label>
            <select
              name="emp_gender"
              value={form.emp_gender}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">{t("select_gender")}</option>
              <option value="Male">{t("male")}</option>
              <option value="Female">{t("female")}</option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>

          {/* MARITAL */}
          <div>
            <label className="text-sm font-medium">
              {t("emp_marital_status")}
            </label>
            <select
              name="emp_marital_status"
              value={form.emp_marital_status}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">{t("select_status")}</option>
              <option value="Single">{t("single")}</option>
              <option value="Married">{t("married")}</option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium">
              {t("phone")}
            </label>
            <input
              name="emp_phone"
              value={form.emp_phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">
              {t("email")}
            </label>
            <input
              name="emp_email"
              value={form.emp_email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* ADDRESS */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">
              {t("emp_permanent_address")}
            </label>
            <input
              name="emp_permanent_address"
              value={form.emp_permanent_address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">
              {t("emp_current_address")}
            </label>
            <input
              name="emp_current_address"
              value={form.emp_current_address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* BANK */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">
              {t("emp_bank_account")}
            </label>
            <input
              name="emp_bank_account"
              value={form.emp_bank_account}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* BUTTONS */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              {initialData ? t("update") : t("save")}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}