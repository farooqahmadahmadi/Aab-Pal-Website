const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/purchaseOrderItemsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, ctrl.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, ctrl.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, ctrl.update);

// ===== DELETE =====
router.delete("/:id", authMiddleware, ctrl.remove);

module.exports = router;
