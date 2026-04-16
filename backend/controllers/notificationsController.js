const NotificationsService = require('../services/notificationsService');

// GET
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationsService.getNotificationsByUser(req.user);
        res.json(Array.isArray(notifications) ? notifications : []);
    } catch (err) {
        console.error("GET ERROR:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// CREATE
exports.createNotification = async (req, res) => {
    try {
        const { notification_recipients, notification_title, notification_message } = req.body;

        if (!notification_recipients || !notification_title || !notification_message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const notification = await NotificationsService.createNotification(req.body);

        // 🔥 REAL-TIME EMIT (SAFE)
        const io = req.app.get("io");
        if (io) {
            io.emit("notification:new", notification);
        }

        res.status(201).json(notification);
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ message: "Invalid ID" });

        const notification = await NotificationsService.markAsRead(id);

        // 🔥 REAL-TIME EMIT
        const io = req.app.get("io");
        if (io) {
            io.emit("notification:read", { id });
        }

        res.json(notification);
    } catch (err) {
        console.error("READ ERROR:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

// DELETE
exports.deleteNotification = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ message: "Invalid ID" });

        await NotificationsService.deleteNotification(id, req.user);

        // 🔥 REAL-TIME EMIT
        const io = req.app.get("io");
        if (io) {
            io.emit("notification:delete", { id });
        }

        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
};