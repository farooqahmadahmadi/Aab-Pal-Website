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

router.get("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.getAllNotifications);
router.get("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.getNotificationById);
router.post("/", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.createNotification);
router.put("/:id", role("Admin", "HR", "Financial", "Project Manager", "Employee"), notificationsController.updateNotification);
router.delete("/:id", role("Admin"), notificationsController.deleteNotification);

module.exports = router;