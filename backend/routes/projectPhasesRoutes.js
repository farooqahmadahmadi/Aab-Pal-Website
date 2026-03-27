const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectPhasesController");

router.get("/", controller.getPhases);
router.get("/:id", controller.getPhase);
router.post("/", controller.createPhase);
router.put("/:id", controller.updatePhase);
router.delete("/:id", controller.deletePhase);

module.exports = router;