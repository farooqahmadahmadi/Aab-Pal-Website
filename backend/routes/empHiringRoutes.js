const express = require("express");
const router = express.Router();
const empHiringController = require("../controllers/empHiringController");

router.get("/", empHiringController.getAllHirings);
router.get("/:id", empHiringController.getHiringById);
router.post("/", empHiringController.createHiring);
router.put("/:id", empHiringController.updateHiring);
router.delete("/:id", empHiringController.deleteHiring);

module.exports = router;