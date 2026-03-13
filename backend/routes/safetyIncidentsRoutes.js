const express = require("express");
const router = express.Router();

const safetyIncidentsController = require("../controllers/safetyIncidentsController");

router.get("/", safetyIncidentsController.getAllIncidents);
router.get("/:id", safetyIncidentsController.getIncidentById);
router.post("/", safetyIncidentsController.createIncident);
router.put("/:id", safetyIncidentsController.updateIncident);
router.delete("/:id", safetyIncidentsController.deleteIncident);

module.exports = router;