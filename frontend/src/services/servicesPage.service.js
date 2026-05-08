import API from "./api";

// ================= GET ALL =================
export const getServices = async () => {
  const res = await API.get("/services-page");

  // SAFE return (handles مختلف backend formats)
  return res.data?.data || res.data || [];
};

// ================= GET ONE =================
export const getService = async (id) => {
  const res = await API.get(`/services-page/${id}`);

  // SAFE normalize (very important for details page)
  return res.data?.data || res.data || null;
};

// ================= CREATE =================
export const createService = async (data) => {
  const res = await API.post("/services-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ================= UPDATE =================
export const updateService = async (id, data) => {
  const res = await API.put(`/services-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ================= DELETE =================
export const deleteService = async (id) => {
  const res = await API.delete(`/services-page/${id}`);

  return res.data;
};
