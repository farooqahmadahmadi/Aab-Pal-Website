const express = require("express");
const router = express.Router();

const poCtrl = require("../controllers/purchaseOrdersController");
const projectCtrl = require("../controllers/projectInfoController");

// 🔹 Purchase Orders routes
router.get("/", poCtrl.getAll);
router.post("/", poCtrl.create);
router.put("/:id", poCtrl.update);
router.delete("/:id", poCtrl.remove);

// 🔹 Projects routes for dropdowns / UI usage
router.get("/projects", projectCtrl.getProjects); // Active projects list

module.exports = router;