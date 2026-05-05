const OurTeamPage = require("../models/OurTeamPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await OurTeamPage.findAll({
    order: [["team_member_id", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await OurTeamPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await OurTeamPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await OurTeamPage.findByPk(id);
  if (!item) throw new Error("Not found");

  return await item.update(data);
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await OurTeamPage.findByPk(id);
  if (!item) throw new Error("Not found");

  return await item.destroy();
};
