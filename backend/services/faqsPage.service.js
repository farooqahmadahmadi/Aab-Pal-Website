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

// ================= ADMIN CREATE =================
const create = async (data) => {
  return await FaqsPage.create(data);
};

// ================= PUBLIC ASK QUESTION =================
const createPublicQuestion = async (data) => {
  return await FaqsPage.create({
    language_id: data.language_id,

    faqs_question: data.faqs_question,

    // AUTO VALUES
    faqs_answer: "",

    faqs_category: "General",

    is_active: false,
  });
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
  createPublicQuestion,
  update,
  remove,
};
