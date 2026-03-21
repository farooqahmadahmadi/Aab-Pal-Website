const CompanyInfo = require("../models/CompanyInfo");

exports.getCompany = async () => {
    return await CompanyInfo.findOne(); // only one company
};

exports.createCompany = async (data) => {
    const existing = await CompanyInfo.findOne();
    if (existing) throw new Error("Company already exists");

    return await CompanyInfo.create(data);
};

exports.updateCompany = async (data) => {
    const company = await CompanyInfo.findOne();
    if (!company) throw new Error("Company not found");

    return await company.update(data);
};