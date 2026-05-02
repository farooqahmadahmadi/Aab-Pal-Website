const WebsiteLanguage = require("../models/WebsiteLanguage");

// Get all languages
const getAllLanguages = async () => {
  return await WebsiteLanguage.findAll({
    order: [["language_id", "ASC"]],
  });
};

// Get single language
const getLanguageById = async (id) => {
  return await WebsiteLanguage.findByPk(id);
};

// Create language
const createLanguage = async (data) => {
  return await WebsiteLanguage.create(data);
};

// Update language
const updateLanguage = async (id, data) => {
  const lang = await WebsiteLanguage.findByPk(id);
  if (!lang) return null;

  return await lang.update(data);
};

// Delete language
const deleteLanguage = async (id) => {
  const lang = await WebsiteLanguage.findByPk(id);
  if (!lang) return null;

  await lang.destroy();
  return true;
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
