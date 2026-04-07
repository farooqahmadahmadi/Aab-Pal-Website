const CompanyInfo = require("../models/CompanyInfo");
const logService = require("./systemLogsService");

// GET
exports.getCompany = async () => {
  return await CompanyInfo.findOne();
};

// CREATE
exports.createCompany = async (data, user_id) => {
  const existing = await CompanyInfo.findOne();
  if (existing) throw new Error("Company already exists");

  const company = await CompanyInfo.create(data);

  await logService.createLog({
    user_id,
    action: "CREATE",
    reference_table: "company_info",
    reference_record_id: company.company_id,
    old_value: null,
    new_value: company.toJSON(),
  });

  return company;
};

// UPDATE
exports.updateCompany = async (data, user_id) => {
  const company = await CompanyInfo.findOne();
  if (!company) throw new Error("Company not found");

  const oldData = company.toJSON();
  const updated = await company.update(data);

  await logService.createLog({
    user_id,
    action: "UPDATE",
    reference_table: "company_info",
    reference_record_id: company.company_id,
    old_value: oldData,
    new_value: updated.toJSON(),
  });

  return updated;
};
