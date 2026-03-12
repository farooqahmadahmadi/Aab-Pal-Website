const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyInfoController");

router.get("/", companyController.getCompanyInfo);
router.get("/:id", companyController.getCompanyById);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

module.exports = router;