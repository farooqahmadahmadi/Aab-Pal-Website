const Notifications = require("../models/Notifications");

// Create Notification
exports.createNotification = async ({
    notification_recipients,
    user_id,
    notification_title,
    notification_message
}) => {

    try {
        const notification = await Notifications.create({
            notification_recipients,
            user_id,
            notification_title,
            notification_message,
            created_at: new Date()
        });
        return notification;
    } catch (error) {
        console.error("Notification Error:", error);
        throw error;
    }
};


// Get Notifications by User
exports.getUserNotifications = async (user_id) => {
    try {
        const notifications = await Notifications.findAll({
            where: { user_id },
            order: [["created_at", "DESC"]]
        });
        return notifications;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Mark Notification as Read
exports.markAsRead = async (notification_id) => {
    try {
        const notification = await Notifications.findByPk(notification_id);
        if (!notification) {
            throw new Error("Notification not found");
        }
        await notification.update({ is_read: true });
        return notification;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Delete Notification
exports.deleteNotification = async (notification_id) => {
    try {
        const notification = await Notifications.findByPk(notification_id);
        if (!notification) {
            throw new Error("Notification not found");
        }
        await notification.destroy();
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};