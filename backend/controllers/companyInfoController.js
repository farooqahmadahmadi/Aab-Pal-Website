const CompanyInfo = require("../models/CompanyInfo");

// GET company info
exports.getCompanyInfo = async (req, res) => {
  try {
    const company = await CompanyInfo.findAll();
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company info", error });
  }
};

// GET company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyInfo.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company", error });
  }
};

// CREATE company
exports.createCompany = async (req, res) => {
  try {
    const company = await CompanyInfo.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error creating company", error });
  }
};

// UPDATE company
exports.updateCompany = async (req, res) => {
  try {
    const company = await CompanyInfo.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    await company.update(req.body);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
};

// DELETE company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await CompanyInfo.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    await company.destroy();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};
