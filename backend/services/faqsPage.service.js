const FaqsPage = require("../models/FaqsPage");

// ================= GET ALL =================
const getAll = async () => {
  return await FaqsPage.findAll({
    order: [["faqs_id", "DESC"]],
  });
};

// ================= GET ONE =================
const getOne = async (id) => {
  return await FaqsPage.findByPk(id);
};

// ================= CREATE =================
const create = async (data) => {
  return await FaqsPage.create(data);
};

// ================= UPDATE =================
const update = async (id, data) => {
  return await FaqsPage.update(data, {
    where: { faqs_id: id },
  });
};

// ================= DELETE =================
const remove = async (id) => {
  return await FaqsPage.destroy({
    where: { faqs_id: id },
  });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
