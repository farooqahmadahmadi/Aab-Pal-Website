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

const materialsController = require("../controllers/materialsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), materialsController.getAllMaterials);
router.get("/:id", role("Admin"), materialsController.getMaterialById);
router.post("/", role("Admin"), materialsController.createMaterial);
router.put("/:id", role("Admin"), materialsController.updateMaterial);
router.delete("/:id", role("Admin"), materialsController.deleteMaterial);

module.exports = router;