/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - No Access
Employee - No Access 
Client - No Access
*/

const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyInfoController");
const role = require("../middlewares/roleMiddleware");

// GET all companies
router.get(
    "/",
    role("Admin"),
    companyController.getCompanyInfo
);

// GET company by ID
router.get(
    "/:id",
    role("Admin"),
    companyController.getCompanyById
);

// CREATE company
router.post(
    "/",
    role("Admin"),
    companyController.createCompany
);

// UPDATE company
router.put(
    "/:id",
    role("Admin"),
    companyController.updateCompany
);

// DELETE company
router.delete(
    "/:id",
    role("Admin"),
    companyController.deleteCompany
);

module.exports = router;