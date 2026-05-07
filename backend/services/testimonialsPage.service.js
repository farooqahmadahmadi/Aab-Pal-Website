const Testimonials = require("../models/TestimonialsPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await Testimonials.findAll({
    order: [["testimonial_id", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await Testimonials.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data, file) => {
  const payload = { ...data };

  if (file) {
    payload.testimonial_photo = `/uploads/testimonials_page/${file.filename}`;
  }

  return await Testimonials.create(payload);
};

// ================= UPDATE =================
exports.update = async (id, data, file) => {
  const item = await Testimonials.findByPk(id);
  if (!item) throw new Error("Not found");

  const payload = { ...data };

  if (file) {
    payload.testimonial_photo = `/uploads/testimonials_page/${file.filename}`;
  }

  return await item.update(payload);
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await Testimonials.findByPk(id);
  if (!item) throw new Error("Not found");

  return await item.destroy();
};
