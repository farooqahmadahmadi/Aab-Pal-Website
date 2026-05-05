const TermsAndConditionsPage = require("../models/TermsAndConditionsPage");

// GET ALL
exports.getAll = async () => {
  return await TermsAndConditionsPage.findAll({
    order: [["display_order", "ASC"]],
  });
};

// GET ONE
exports.getOne = async (id) => {
  return await TermsAndConditionsPage.findByPk(id);
};

// CREATE
exports.create = async (data) => {
  return await TermsAndConditionsPage.create(data);
};

// UPDATE
exports.update = async (id, data) => {
  return await TermsAndConditionsPage.update(data, {
    where: { tc_id: id },
  });
};

// DELETE
exports.remove = async (id) => {
  return await TermsAndConditionsPage.destroy({
    where: { tc_id: id },
  });
};
