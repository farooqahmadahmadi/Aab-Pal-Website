import React, { useEffect, useState } from "react";
import {
  createTeamMember,
  updateTeamMember,
} from "../../services/ourTeamPage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function OurTeamModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    language_id: "",
    member_full_name: "",
    member_position: "",
    member_biography: "",
    member_photo: null,
  });

  // ================= LOAD LANGUAGES =================
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getLanguages();
        setLanguages(res?.data?.data || res?.data || []);
      } catch {
        showToast("Failed to load languages", "error");
      }
    };

    fetchLanguages();
  }, []);

  // ================= EDIT LOAD =================
  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        member_full_name: edit.member_full_name || "",
        member_position: edit.member_position || "",
        member_biography: edit.member_biography || "",
        member_photo: null,
      });

      setFileName("");
    }
  }, [edit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "member_photo") {
      const file = files[0];
      setForm((prev) => ({ ...prev, member_photo: file }));
      setFileName(file?.name || "");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.member_full_name || !form.member_position) {
        showToast("Name & position required", "error");
        return;
      }

      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await updateTeamMember(edit.team_member_id, fd);
        showToast("Updated successfully", "success");
      } else {
        await createTeamMember(fd);
        showToast("Created successfully", "success");
      }

      onRefresh();
      onClose();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl p-5 rounded-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Team Member" : "Add Team Member"}
        </h2>

        {/* LANGUAGE */}
        <label className="text-sm">Language</label>
        <select
          name="language_id"
          value={form.language_id}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select</option>
          {languages.map((l) => (
            <option key={l.language_id} value={l.language_id}>
              {l.language_name}
            </option>
          ))}
        </select>

        {/* NAME */}
        <label className="text-sm">Full Name</label>
        <input
          name="member_full_name"
          value={form.member_full_name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* POSITION */}
        <label className="text-sm">Position</label>
        <input
          name="member_position"
          value={form.member_position}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* BIO */}
        <label className="text-sm">Biography</label>
        <textarea
          name="member_biography"
          value={form.member_biography}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded min-h-[120px]"
        />

        {/* IMAGE */}
        <label className="text-sm">Photo</label>
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>

          <input
            type="file"
            name="member_photo"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
