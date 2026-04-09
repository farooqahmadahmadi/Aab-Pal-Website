const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/boqItemsController");

// ===== GET ALL =====
router.get("/", authMiddleware, ctrl.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, ctrl.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, ctrl.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, ctrl.remove);

module.exports = router;
