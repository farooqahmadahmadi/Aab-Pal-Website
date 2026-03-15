// routes/notificationsRoutes.js
/* Access Controls
Admin - Full Access
HR - Create, Read, Update Access
Financial - Create, Read, Update Access
Project Manager - Create, Read, Update Access
Employee - Create, Read, Update Access
Client - Read Access (only their own notifications)
*/

const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notificationsController");
const role = require("../middlewares/roleMiddleware");

// GET all notifications → Admin, HR, Financial, PM, Employee
router.get("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.getAllNotifications);
// GET notification by ID → Admin, HR, Financial, PM, Employee
router.get("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.getNotificationById);
// CREATE notification → Admin, HR, Financial, PM, Employee
router.post("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.createNotification);
// UPDATE notification → Admin, HR, Financial, PM, Employee
router.put("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.updateNotification);
// DELETE notification → Admin only
router.delete("/:id", role("Admin"),notificationsController.deleteNotification);

module.exports = router;