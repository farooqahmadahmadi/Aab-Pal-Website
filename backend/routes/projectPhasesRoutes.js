const express = require("express");
const router = express.Router();

const projectPhasesController = require("../controllers/projectPhasesController");

router.get("/", projectPhasesController.getAllPhases);
router.get("/:id", projectPhasesController.getPhaseById);
router.post("/", projectPhasesController.createPhase);
router.put("/:id", projectPhasesController.updatePhase);
router.delete("/:id", projectPhasesController.deletePhase);

module.exports = router;