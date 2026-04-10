const Notifications = require("../models/Notifications");
const { Op } = require("sequelize");

class NotificationsService {
  async getNotificationsByUser(user) {
    try {
      // ✅ ADMIN → ټول notifications
      if (user.role === "Admin") {
        return Notifications.findAll({
          order: [["created_at", "DESC"]],
        });
      }

      // ✅ NORMAL USER →
      // 1. personal notifications (user_id match)
      // 2. role-based notifications (user_id null + recipients = role)

      return Notifications.findAll({
        where: {
          [Op.or]: [
            { user_id: user.user_id },
            {
              user_id: null,
              notification_recipients: user.role,
            },
          ],
        },
        order: [["created_at", "DESC"]],
      });
    } catch (err) {
      console.error("GET NOTIFICATIONS ERROR:", err.message);
      throw new Error("Failed to fetch notifications");
    }
  }

  async createNotification(data) {
    try {
      return await Notifications.create(data);
    } catch (err) {
      console.error("CREATE NOTIFICATION ERROR:", err.message);
      throw new Error("Failed to create notification");
    }
  }

  async markAsRead(id) {
    try {
      const notif = await Notifications.findByPk(id);
      if (!notif) throw new Error("Notification not found");

      notif.is_read = true;
      return await notif.save();
    } catch (err) {
      console.error("MARK READ ERROR:", err.message);
      throw new Error("Failed to mark as read");
    }
  }

  async deleteNotification(id) {
    try {
      const notif = await Notifications.findByPk(id);
      if (!notif) throw new Error("Notification not found");

      return await notif.destroy();
    } catch (err) {
      console.error("DELETE NOTIFICATION ERROR:", err.message);
      throw new Error("Failed to delete notification");
    }
  }
}

module.exports = new NotificationsService();
