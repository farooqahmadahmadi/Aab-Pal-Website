/* Access Controls
Admin - Full Access
HR - Create, Read Access
Financial - Create, Read Access
Project Manager - Create, Read Access
Employee - Create, Read Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const safetyIncidentsController = require("../controllers/safetyIncidentsController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), safetyIncidentsController.getAllIncidents);
router.get("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), safetyIncidentsController.getIncidentById);
router.post("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), safetyIncidentsController.createIncident);
router.put("/:id", role("Admin"), safetyIncidentsController.updateIncident);
router.delete("/:id", role("Admin"), safetyIncidentsController.deleteIncident);

module.exports = router;