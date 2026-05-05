import React, { useEffect, useState } from "react";
import {
  createProject,
  updateProject,
} from "../../services/ourProjectsPage.service";

import { getLanguages } from "../../services/websiteLanguage.service";

import Toast from "../common/Toast";
import useToast from "../../hooks/useToast";

export default function OurProjectsModal({ open, onClose, edit, onRefresh }) {
  const isEdit = !!edit;
  const { toast, showToast, hideToast } = useToast();

  const [languages, setLanguages] = useState([]);
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    language_id: "",
    project_name: "",
    project_address: "",
    project_image: null,
    project_status: "ongoing",
  });

  // LOAD LANGUAGES
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLanguages();
        setLanguages(res?.data?.data || res?.data || []);
      } catch {
        showToast("Failed to load languages", "error");
      }
    };
    fetch();
  }, []);

  // EDIT LOAD
  useEffect(() => {
    if (edit) {
      setForm({
        language_id: edit.language_id || "",
        project_name: edit.project_name || "",
        project_address: edit.project_address || "",
        project_image: null,
        project_status: edit.project_status || "ongoing",
      });

      setFileName("");
    }
  }, [edit]);

  // CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "project_image") {
      const file = files[0];
      setForm((p) => ({ ...p, project_image: file }));
      setFileName(file?.name || "");
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      if (!form.project_name) {
        showToast("Project name required", "error");
        return;
      }

      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await updateProject(edit.project_id, fd);
        showToast("Updated successfully", "success");
      } else {
        await createProject(fd);
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
          {isEdit ? "Edit Project" : "Add Project"}
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
        <label className="text-sm">Project Name</label>
        <input
          name="project_name"
          value={form.project_name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* ADDRESS */}
        <label className="text-sm">Address</label>
        <input
          name="project_address"
          value={form.project_address}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* STATUS */}
        <label className="text-sm">Status</label>
        <select
          name="project_status"
          value={form.project_status}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        {/* IMAGE */}
        <label className="text-sm">Image</label>
        <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer mb-3">
          <span className="text-gray-500 text-sm">
            {fileName || "Choose Image"}
          </span>

          <input
            type="file"
            name="project_image"
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
