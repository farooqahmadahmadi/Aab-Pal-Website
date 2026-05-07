import API from "./api";

// ================= GET ALL =================
export const getTestimonials = async () => {
  const res = await API.get("/testimonials-page");
  return res.data;
};

// ================= GET ONE =================
export const getTestimonial = async (id) => {
  const res = await API.get(`/testimonials-page/${id}`);
  return res.data;
};


// CREATE PUBLIC TESTIMONIAL
export const createPublicTestimonial = async (data) => {
  const res = await API.post(
    "/testimonials-page/addpublictestimonial",
    data
  );
  return res.data;
};

// ================= CREATE =================
export const createTestimonial = async (data) => {
  const res = await API.post("/testimonials-page", data);
  return res.data;
};

// ================= UPDATE =================
export const updateTestimonial = async (id, data) => {
  const res = await API.put(`/testimonials-page/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteTestimonial = async (id) => {
  const res = await API.delete(`/testimonials-page/${id}`);
  return res.data;
};