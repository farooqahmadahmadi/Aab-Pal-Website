import { useEffect, useState } from "react";
import defaultAvatar from "../../assets/images/client-def-image.png";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCamera,
  FiUnlock,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { getUserById, uploadUserPhoto } from "../../services/userService";
import UserChangePasswordModal from "../../components/Users/UserChangePasswordModal";

const BASE_URL = import.meta.env.VITE_IMAGE_URL;

export default function Profile() {
  const { t } = useTranslation();

  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // FETCH
  const fetchUser = async () => {
    try {
      const res = await getUserById(loggedUser.user_id);
      setUser(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // IMAGE
  const getAvatar = () => {
    if (!user?.user_photo_url) return defaultAvatar;
    return `${BASE_URL}${user.user_photo_url}?t=${Date.now()}`;
  };

  // UPLOAD
  const uploadPhoto = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("user_photo_url", file);

    try {
      setLoading(true);

      const res = await uploadUserPhoto(loggedUser.user_id, formData);

      setUser((prev) => ({
        ...prev,
        user_photo_url: res.data.user_photo_url,
      }));

      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* ===== HEADER CARD ===== */}
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-5 items-center">
        {/* AVATAR */}
        <div className="relative">
          <img
            src={getAvatar()}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
          />

          <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
            <FiCamera size={16} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* INFO */}
        <div className="flex-1 w-full space-y-2 text-left">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FiUser /> {user.user_name || t("na")}
          </h2>

          <p className="text-gray-600 flex items-center gap-2">
            <FiMail /> {user.user_email || t("na")}
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            <FiPhone /> {user.user_phone || t("na")}
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            <FiShield /> {user.user_role || t("na")}
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            {t("status")}: {user.login_status || t("na")}
          </p>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3 justify-center md:justify-start">
            {file && (
              <button
                onClick={uploadPhoto}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? t("uploading") : t("save_photo")}
              </button>
            )}

            <button
              onClick={() => setShowPassModal(true)}
              className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              <FiUnlock /> {t("change_password")}
            </button>
          </div>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Info label={t("user_id")} value={user.user_id} />
        <Info label={t("employee_id")} value={user.employee_id} />
        <Info label={t("user_name")} value={user.user_name} />
        <Info label={t("email")} value={user.user_email} />
        <Info label={t("role")} value={user.user_role} />
        <Info label={t("status")} value={user.login_status} />
        <Info label={t("access_start")} value={user.access_time_start} />
        <Info label={t("access_end")} value={user.access_time_end} />

        <Info
          label={t("created_at")}
          value={
            user.created_at ? new Date(user.created_at).toLocaleString() : null
          }
        />

        <Info
          label={t("last_login")}
          value={
            user.last_login_at
              ? new Date(user.last_login_at).toLocaleString()
              : null
          }
        />
      </div>

      {/* PASSWORD MODAL */}
      {showPassModal && (
        <UserChangePasswordModal onClose={() => setShowPassModal(false)} />
      )}
    </div>
  );
}

// SMALL COMPONENT (SAFE)
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="font-medium break-words">{value || "N/A"}</p>
    </div>
  );
}
