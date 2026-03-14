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

const equipmentController = require("../controllers/equipmentController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin"), equipmentController.getAllEquipment);
router.get("/:id", role("Admin"), equipmentController.getEquipmentById);
router.post("/", role("Admin"), equipmentController.createEquipment);
router.put("/:id", role("Admin"), equipmentController.updateEquipment);
router.delete("/:id", role("Admin"), equipmentController.deleteEquipment);

module.exports = router;