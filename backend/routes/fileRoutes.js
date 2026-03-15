const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const upload = require("../middlewares/uploadMiddleware");
const role = require("../middlewares/roleMiddleware");

// Upload: Admin, HR, Project Manager
router.post("/upload", role("Admin", "HR", "Project Manager"), upload.single("file"), fileController.uploadFile);

// Update: Admin, HR, Project Manager
router.put("/update", role("Admin", "HR", "Project Manager"), upload.single("file"), fileController.updateFile);

// Download: All roles (if access allowed)
router.get("/download/:section/:filename", role("Admin", "HR", "Project Manager", "Employee", "Client"), fileController.downloadFile);

// Delete: Admin only
router.delete("/delete/:section/:filename", role("Admin"), fileController.deleteFile);

module.exports = router;