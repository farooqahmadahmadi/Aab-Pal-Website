const Notifications = require('../models/Notifications');

class NotificationsService {
    async getNotificationsByUser(user) {
        if (user.role === 'Admin') {
            return Notifications.findAll({ order: [['created_at', 'DESC']] });
        }
        return Notifications.findAll({
            where: { user_id: user.user_id },
            order: [['created_at', 'DESC']]
        });
    }

    async createNotification(data) {
        return Notifications.create(data);
    }

    async markAsRead(id) {
        const notif = await Notifications.findByPk(id);
        if (!notif) throw new Error('Notification not found');
        notif.is_read = true;
        return notif.save();
    }

    async deleteNotification(id, user) {
        if (user.role !== 'Admin') throw new Error('Unauthorized');
        const notif = await Notifications.findByPk(id);
        if (!notif) throw new Error('Notification not found');
        return notif.destroy();
    }
}

module.exports = new NotificationsService();