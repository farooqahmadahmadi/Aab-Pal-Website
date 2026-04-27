import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_IMAGE_URL;
// const BASE_URL = import.meta.env.VITE_API_URL;

export default function CompanyInfo() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa" || i18n.language === "ps";

  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState("/default-logo.png");
  const { toast, showToast, hideToast } = useToast();

  // ===== Fetch =====
  const fetchData = async () => {
    try {
      const res = await API.get("/company");
      const companyData = res.data || {};
      setData(companyData);

      if (companyData?.company_logo_url) {
        setLogoPreview(`${BASE_URL}${companyData.company_logo_url}`);
      } else {
        setLogoPreview("/default-logo.png");
      }
    } catch (err) {
      showToast(t("company_load_error"), "error");
      setData({});
      setLogoPreview("/default-logo.png");
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

  // ===== Logo Upload =====
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setData({ ...data, logoFile: file });
    setLogoPreview(URL.createObjectURL(file));
  };

  // ===== Save =====
  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "logoFile") formData.append(key, data[key]);
      });

      if (data.logoFile) formData.append("logo", data.logoFile);

      await API.put("/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(t("company_update_success"), "success");
      setEditMode(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(t("company_update_error"), "error");
    }
  };

  return (
    <>
      <div className="p-3 flex justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-4xl relative border">
          {/* ===== Edit / Save ===== */}
          <div className={`absolute top-3 ${isRTL ? "left-3" : "right-3"}`}>
            {!editMode ? (
              <div
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full cursor-pointer"
                title={t("edit")}
              >
                <FaEdit />
              </div>
            ) : (
              <div
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full cursor-pointer"
                title={t("save")}
              >
                <FaSave />
              </div>
            )}
          </div>

          {/* ===== Logo ===== */}
          <div className="flex justify-center mb-6">
            <div className="relative group w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden">
              <img
                src={logoPreview}
                alt="logo"
                className="w-full h-full object-cover"
              />

              {editMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 group-hover:opacity-100 transition">
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

          {/* ===== Title ===== */}
          <h2 className="text-2xl font-bold text-center mb-6">
            {t("company_information")}
          </h2>

          {/* ===== FORM ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("company_name")}
              </label>
              <input
                name="company_name"
                value={data.company_name || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>

            {/* License Number */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("license_number")}
              </label>
              <input
                name="license_number"
                value={data.license_number || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>

            {/* Expire Date */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("license_expire_date")}
              </label>
              <input
                type="date"
                name="license_expire_date"
                value={data.license_expire_date?.slice(0, 10) || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("phone")}
              </label>
              <input
                name="company_phone"
                value={data.company_phone || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">
                {t("email")}
              </label>
              <input
                name="company_email"
                value={data.company_email || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">
                {t("address")}
              </label>
              <input
                name="company_address"
                value={data.company_address || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="border p-3 rounded w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          position="center"
        />
      )}
    </>
  );
}
