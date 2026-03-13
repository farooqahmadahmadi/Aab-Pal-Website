const Notifications = require("../models/Notifications");

// GET all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.findAll();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// GET notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notification", error });
    }
};

// CREATE notification
exports.createNotification = async (req, res) => {
    try {
        const notification = await Notifications.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification", error });
    }
};

// UPDATE notification
exports.updateNotification = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await notification.update(req.body);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};

// DELETE notification (soft delete)
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notifications.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await notification.destroy();
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error });
    }
};