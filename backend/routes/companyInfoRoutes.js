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

router.get("/", role("Admin"), companyController.getCompanyInfo);
router.get("/:id", role("Admin"), companyController.getCompanyById);
router.post("/", role("Admin"), companyController.createCompany);
router.put("/:id", role("Admin"), companyController.updateCompany);
router.delete("/:id", role("Admin"), companyController.deleteCompany);

module.exports = router;