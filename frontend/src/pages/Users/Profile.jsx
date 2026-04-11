import { useEffect, useState } from "react";
import defaultAvatar from "../../assets/images/client-def-image.png";
import {
  FiUpload,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiLock,
} from "react-icons/fi";

import {
  getUserById,
  uploadUserPhoto,
} from "../../services/userService";

import UserChangePasswordModal from "../../components/Users/UserChangePasswordModal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ================= FETCH USER =================
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

  // ================= FIX IMAGE URL =================
  const getAvatar = () => {
    if (!user?.user_photo_url) return defaultAvatar;

    return `${BASE_URL}${user.user_photo_url}?t=${Date.now()}`;
  };

  // ================= UPLOAD PHOTO =================
  const uploadPhoto = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("user_photo_url", file);

    try {
      setLoading(true);

      const res = await uploadUserPhoto(
        loggedUser.user_id,
        formData
      );

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
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">

        {/* AVATAR */}
        <div className="relative">
          <img
            src={getAvatar()}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />

          {/* Upload */}
          <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white cursor-pointer hover:bg-blue-600">
            <FiUpload size={14} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-2">

          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiUser /> {user.user_name || "N/A"}
          </h2>

          <p className="text-gray-600 flex items-center gap-2">
            <FiMail /> {user.user_email || "N/A"}
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            <FiPhone /> {user.user_phone || "N/A"}
          </p>

          <p className="text-gray-600 flex items-center gap-2">
            <FiShield /> {user.user_role || "N/A"}
          </p>

          <p className="text-sm text-gray-400">
            Status: {user.login_status || "N/A"}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-2">

            {file && (
              <button
                onClick={uploadPhoto}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {loading ? "Uploading..." : "Save Photo"}
              </button>
            )}

            <button
              onClick={() => setShowPassModal(true)}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              <FiLock /> Change Password
            </button>

          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-6 bg-white shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <h3 className="font-semibold text-gray-700">User ID</h3>
          <p>{user.user_id || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Employee ID</h3>
          <p>{user.employee_id || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">User Name</h3>
          <p>{user.user_name || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Email</h3>
          <p>{user.user_email || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Role</h3>
          <p>{user.user_role || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Created At</h3>
          <p>
            {user.created_at
              ? new Date(user.created_at).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Last Login</h3>
          <p>
            {user.last_login_at
              ? new Date(user.last_login_at).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Status</h3>
          <p>{user.login_status || "N/A"}</p>
        </div>

      </div>

      {/* PASSWORD MODAL */}
      {showPassModal && (
        <UserChangePasswordModal
          onClose={() => setShowPassModal(false)}
        />
      )}
    </div>
  );
}