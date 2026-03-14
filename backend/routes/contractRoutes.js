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

const contractController = require("../controllers/contractController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), contractController.getAllContracts);
router.get("/:id", role("Admin"), contractController.getContractById);
router.post("/", role("Admin"), contractController.createContract);
router.put("/:id", role("Admin"), contractController.updateContract);
router.delete("/:id", role("Admin"), contractController.deleteContract);

module.exports = router;