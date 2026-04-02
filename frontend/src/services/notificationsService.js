import API from "./api";

export const getNotifications = () => API.get("/notifications");
export const addNotification = (data) => API.post("/notifications", data);
export const markNotificationAsRead = (id) => API.put(`/notifications/read/${id}`);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
