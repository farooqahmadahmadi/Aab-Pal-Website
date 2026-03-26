import API from "./api";

// ===== GET ALL (for admin/list) =====
export const getAttendance = () =>
    API.get("/employee-attendance");

// ===== GET TODAY FOR LOGGED-IN USER =====
export const getTodayAttendance = () =>
    API.get("/employee-attendance/me");

// ===== CHECK IN =====
export const checkIn = (data) =>
    API.post("/employee-attendance/check-in", data);

// ===== CHECK OUT =====
export const checkOut = (data) =>
    API.post("/employee-attendance/check-out", data);

// ===== MANUAL CREATE =====
export const createAttendance = (data) =>
    API.post("/employee-attendance/manual", data);

// ===== UPDATE =====
export const updateAttendance = (id, data) =>
    API.put(`/employee-attendance/${id}`, data);

// ===== DELETE =====
export const deleteAttendance = (id) =>
    API.delete(`/employee-attendance/${id}`);