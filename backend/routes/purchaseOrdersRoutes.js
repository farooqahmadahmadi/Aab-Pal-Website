const express = require("express");
const router = express.Router();

const poCtrl = require("../controllers/purchaseOrdersController");
const projectCtrl = require("../controllers/projectInfoController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Projects routes for dropdowns / UI usage
router.get("/projects", authMiddleware, projectCtrl.getProjects); // Active projects list

// Purchase Orders routes
// ===== GET ALL =====
router.get("/", authMiddleware, poCtrl.getAll);

// ===== CREATE =====
router.post("/", authMiddleware, poCtrl.create);

// ===== UPDATE =====
router.put("/:id", authMiddleware, poCtrl.update);

// ===== DELTE =====
router.delete("/:id", authMiddleware, poCtrl.remove);

module.exports = router;
