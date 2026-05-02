import API from "./api";

// ================= LOGIN =================
export const loginUser = (data) => {
  return API.post("/users/login", data);
};

// ================= LOGOUT =================
export const logoutUser = () => {
  return API.post("/users/logout");
};

// ================= GET USERS =================
export const getUsers = () => {
  return API.get("/users");
};

// ================= GET USER BY ID =================
export const getUserById = (id) => {
  return API.get(`/users/${id}`);
};

// ================= CREATE USER =================
export const createUser = (data) => {
  return API.post("/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= UPDATE USER =================
export const updateUser = (id, data) => {
  return API.put(`/users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= DELETE USER =================
export const deleteUser = (id) => {
  return API.delete(`/users/${id}`);
};

// ================= CHANGE PASSWORD =================
export const changePassword = (data) => {
  return API.post("/users/change-password", data);
};

// ================= ADMIN RESET PASSWORD =================
export const adminResetPassword = (id) => {
  return API.post(`/users/${id}/reset-password`);
};

// ================= UPLOAD PHOTO ONLY =================
export const uploadUserPhoto = (id, file) => {
  const formData = new FormData();
  formData.append("user_photo_url", file);

  return API.post(`/users/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
