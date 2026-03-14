/* Access Controls
Admin - Full Access
HR - Full Access
Financial - No Access
Project Manager - No Access
Employee - view Access (only their own hiring records)
Client - No Access
*/

const express = require("express");
const router = express.Router();

const empHiringController = require("../controllers/empHiringController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR"), empHiringController.getAllHirings);
router.get("/:id", role("Admin", "HR", "Employee"), empHiringController.getHiringById);
router.post("/", role("Admin", "HR"), empHiringController.createHiring);
router.put("/:id", role("Admin", "HR"), empHiringController.updateHiring);
router.delete("/:id", role("Admin","HR"), empHiringController.deleteHiring);

module.exports = router;