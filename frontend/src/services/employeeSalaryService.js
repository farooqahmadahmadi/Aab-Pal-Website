import API from "./api";

const API_URL = "/employee-salary"; // api.js کې baseURL شته، دلته یوازې endpoint

export const getSalaries = async () => {
  const res = await API.get(API_URL);
  return res.data;
};

export const createSalary = async (data) => {
  const res = await API.post(API_URL, data);
  return res.data;
};

export const updateSalary = async (id, data) => {
  const res = await API.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteSalary = async (id) => {
  const res = await API.delete(`${API_URL}/${id}`);
  return res.data;
};
