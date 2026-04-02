const express = require("express");
const router = express.Router();
const {
    getNotifications,
    createNotification,
    markAsRead,
    deleteNotification
} = require("../controllers/notificationsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", getNotifications);
router.post("/", createNotification);
router.put("/read/:id", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;