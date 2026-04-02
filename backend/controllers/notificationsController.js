const NotificationsService = require('../services/notificationsService');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationsService.getNotificationsByUser(req.user);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = await NotificationsService.createNotification(req.body);
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await NotificationsService.markAsRead(req.params.id);
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await NotificationsService.deleteNotification(req.params.id, req.user);
        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};