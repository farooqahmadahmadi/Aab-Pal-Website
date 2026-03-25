const express = require("express");
const router = express.Router();
const controller = require("../controllers/empHiringInfoController");

// CRUD
router.get("/", controller.getAllHiring);
router.get("/:id", controller.getHiringById);
router.post("/", controller.addHiring);
router.put("/:id", controller.updateHiring);
router.delete("/:id", controller.deleteHiring);

module.exports = router;
