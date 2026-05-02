import React, { useEffect, useState } from "react";
import { createLanguage, updateLanguage } from "../../services";

export default function LanguageModal({
  isOpen,
  onClose,
  initialData,
  onRefresh,
}) {
  const [form, setForm] = useState({
    language_code: "",
    language_name: "",
    language_direction: "LTR",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        language_code: "",
        language_name: "",
        language_direction: "LTR",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (initialData) {
        await updateLanguage(initialData.language_id, form);
      } else {
        await createLanguage(form);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-3">
          {initialData ? "Edit Language" : "Add Language"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="language_code"
            value={form.language_code}
            onChange={handleChange}
            placeholder="Code (e.g. en)"
            className="border p-2 w-full"
          />

          <input
            name="language_name"
            value={form.language_name}
            onChange={handleChange}
            placeholder="Language Name"
            className="border p-2 w-full"
          />

          <select
            name="language_direction"
            value={form.language_direction}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="LTR">LTR</option>
            <option value="RTL">RTL</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="bg-green-500 text-white px-3 py-1">
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
