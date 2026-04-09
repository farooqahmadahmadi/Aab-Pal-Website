const express = require("express");
const router = express.Router();

const { uploadEquipmentDoc } = require("../middlewares/uploadMiddleware");
const ctrl = require("../controllers/equipmentDocumentsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, ctrl.getAll);

// ===== CREATE =====
router.post(
  "/",
  authMiddleware,
  uploadEquipmentDoc.single("doc_file"),
  ctrl.create,
);

// ===== UPDATE =====
router.put(
  "/:id",
  authMiddleware,
  uploadEquipmentDoc.single("doc_file"),
  ctrl.update,
);

// ===== DELETE =====
router.delete("/:id", authMiddleware, ctrl.remove);

module.exports = router;
