/* Access Controls
Admin - Full Access
HR - No Access
Financial - No Access
Project Manager - Full Access
Employee - No Access
Client - View Access (Only for their projects)
*/

const express = require("express");
const router = express.Router();

const projectPhasesController = require("../controllers/projectPhasesController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Project Manager"), projectPhasesController.getAllPhases);
router.get("/:id", role("Admin", "Project Manager", "Client"), projectPhasesController.getPhaseById);
router.post("/", role("Admin", "Project Manager"), projectPhasesController.createPhase);
router.put("/:id", role("Admin", "Project Manager"), projectPhasesController.updatePhase);
router.delete("/:id", role("Admin","Project Manager"), projectPhasesController.deletePhase);

module.exports = router;