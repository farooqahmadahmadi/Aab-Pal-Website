const Testimonials = require("../models/TestimonialsPage");

// GET ALL
exports.getAll = async () => {
  return await Testimonials.findAll({
    order: [["testimonial_id", "DESC"]],
  });
};

// GET ONE
exports.getOne = async (id) => {
  return await Testimonials.findByPk(id);
};

// CREATE
exports.create = async (data, file) => {
  if (file) {
    data.testimonial_photo = `/uploads/testimonials_page/${file.filename}`;
  }

  return await Testimonials.create(data);
};

// UPDATE
exports.update = async (id, data, file) => {
  const item = await Testimonials.findByPk(id);
  if (!item) throw new Error("Not found");

  if (file) {
    data.testimonial_photo = `/uploads/testimonials_page/${file.filename}`;
  }

  return await item.update(data);
};

// DELETE
exports.remove = async (id) => {
  const item = await Testimonials.findByPk(id);
  if (!item) throw new Error("Not found");

  await item.destroy();
};
