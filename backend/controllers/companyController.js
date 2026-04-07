const fs = require("fs");
const path = require("path");
const {
  getCompany,
  createCompany,
  updateCompany,
} = require("../services/companyService");

// GET Company Info
exports.getCompanyInfo = async (req, res) => {
  try {
    const company = await getCompany();
    res.json(company || {});
  } catch (err) {
    console.error("GET COMPANY ERROR:", err.message);
    res.status(500).json({ message: "Failed to load company info" });
  }
};

// CREATE Company Info
exports.createCompanyInfo = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.company_logo_url = `/uploads/logos/${req.file.filename}`;
    }

    const company = await createCompany(data, req.user?.user_id);
    res.status(201).json(company);
  } catch (err) {
    console.error("CREATE COMPANY ERROR:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to create company" });
  }
};

// UPDATE Company Info
exports.updateCompanyInfo = async (req, res) => {
  try {
    const company = await getCompany();
    if (!company) throw new Error("Company not found");

    const data = { ...req.body };

    if (req.file) {
      // Delete old logo safely
      if (company.company_logo_url) {
        const oldPath = path.join(
          __dirname,
          "..",
          company.company_logo_url.replace(/^\/+/, ""), );
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.error("FILE DELETE ERROR:", err.message);
        }
      }
      data.company_logo_url = `/uploads/logos/${req.file.filename}`;
    }

    const updated = await updateCompany(data, req.user?.user_id);
    res.json(updated);
  } catch (err) {
    console.error("UPDATE COMPANY ERROR:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to update company" });
  }
};
