import API from "./api";

// GET ALL
export const getTerms = async () => {
  const res = await API.get("/terms-and-conditions");
  return res.data;
};

// GET ONE
export const getTerm = async (id) => {
  const res = await API.get(`/terms-and-conditions/${id}`);
  return res.data;
};

// CREATE
export const createTerm = async (data) => {
  const res = await API.post("/terms-and-conditions", data);
  return res.data;
};

// UPDATE
export const updateTerm = async (id, data) => {
  const res = await API.put(`/terms-and-conditions/${id}`, data);
  return res.data;
};

// DELETE
export const deleteTerm = async (id) => {
  const res = await API.delete(`/terms-and-conditions/${id}`);
  return res.data;
};
