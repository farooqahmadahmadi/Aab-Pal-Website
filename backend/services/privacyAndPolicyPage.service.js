const PrivacyAndPolicyPage = require("../models/PrivacyAndPolicyPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await PrivacyAndPolicyPage.findAll({
    order: [["display_order", "ASC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await PrivacyAndPolicyPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await PrivacyAndPolicyPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  return await PrivacyAndPolicyPage.update(data, {
    where: { pp_id: id },
  });
};

// ================= DELETE =================
exports.remove = async (id) => {
  return await PrivacyAndPolicyPage.destroy({
    where: { pp_id: id },
  });
};
