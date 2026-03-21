const fs = require("fs");
const path = require("path");
const { getCompany, createCompany, updateCompany } = require("../services/companyService");

// GET
exports.getCompanyInfo = async (req, res) => {
    try {
        const company = await getCompany();
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.createCompanyInfo = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.company_logo_url = `/uploads/logos/${req.file.filename}`;
        const company = await createCompany(data);
        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.updateCompanyInfo = async (req, res) => {
    try {
        const company = await getCompany();
        if (!company) throw new Error("Company not found");

        const data = { ...req.body };

        if (req.file) {
            // Delete old logo
            if (company.company_logo_url) {
                const oldPath = path.join(__dirname, "../", company.company_logo_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.company_logo_url = `/uploads/logos/${req.file.filename}`;
        }

        const updated = await updateCompany(data);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
