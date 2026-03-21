import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CompanyInfo() {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  // ===== Fetch =====
  const fetchData = async () => {
    try {
      const res = await API.get("/company");

      setData(res.data);

      if (res.data?.company_logo_url) {
        setLogoPreview(`${BASE_URL}${res.data.company_logo_url}`);
      } else {
        setLogoPreview(null);
      }

    } catch (err) {
      showToast("Failed to load company info", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== Input =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // ===== Logo Upload Preview =====
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setData({ ...data, logoFile: file });

    // 🔥 instant preview
    setLogoPreview(URL.createObjectURL(file));
  };

  // ===== Save =====
  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "logoFile") {
          formData.append(key, data[key]);
        }
      });

      if (data.logoFile) {
        formData.append("logo", data.logoFile);
      }

      await API.put("/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Company info updated successfully", "success");
      setEditMode(false);
      fetchData();

    } catch (err) {
      console.error(err);
      showToast("Failed to update company info", "error");
    }
  };

  return (
    <>
      <div className="p-2 flex justify-center">
        <div className="bg-white backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-2xl relative border">

          {/* Edit / Save */}
          <div className="absolute top-4 right-4 ">
            {!editMode ? (
              <button onClick={() => setEditMode(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaEdit /> Edit
              </button>
            ) : (
              <button onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaSave /> Save
              </button>
            )}
          </div>

          {/* ===== Logo ===== */}
          <div className="flex justify-center mb-6">
            <div className="relative group">

              <img
                src={logoPreview || "/default-logo.png"}   // 🔥 NO external URL
                alt="Company Logo"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />

              {editMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}

            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-6">
            Company Information
          </h2>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

            <input name="company_name" value={data.company_name || ""} onChange={handleChange} disabled={!editMode} placeholder="Company Name" className="border p-3 rounded w-full" />

            <input name="license_number" value={data.license_number || ""} onChange={handleChange} disabled={!editMode} placeholder="License Number" className="border p-3 rounded w-full" />

            <input type="date" name="license_expire_date"
              value={data.license_expire_date?.slice(0, 10) || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="border p-3 rounded w-full" />

            <input name="company_phone" value={data.company_phone || ""} onChange={handleChange} disabled={!editMode} placeholder="Phone" className="border p-3 rounded w-full" />

            <input name="company_email" value={data.company_email || ""} onChange={handleChange} disabled={!editMode} placeholder="Email" className="border p-3 rounded w-full col-span-2" />

            <input name="company_address" value={data.company_address || ""} onChange={handleChange} disabled={!editMode} placeholder="Address" className="border p-3 rounded w-full col-span-2" />

          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} position="center" />
      )}
    </>
  );
}