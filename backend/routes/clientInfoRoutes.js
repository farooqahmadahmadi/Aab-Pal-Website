const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/clientInfoController");
const { uploadClient } = require("../middlewares/uploadMiddleware");

// ===== GET ALL =====
router.get("/", authMiddleware, controller.getAllClients);

// ===== GET BY ID =====
router.get("/:id", authMiddleware, controller.getClientById);

// ===== CREATE =====
router.post(
  "/",
  authMiddleware,
  uploadClient.single("client_photo"),
  controller.addClient,
);

// ===== UPDATE =====
router.put(
  "/:id",
  authMiddleware,
  uploadClient.single("client_photo"),
  controller.updateClient,
);

// ===== DELETE =====
router.delete("/:id", authMiddleware, controller.deleteClient);

module.exports = router;
