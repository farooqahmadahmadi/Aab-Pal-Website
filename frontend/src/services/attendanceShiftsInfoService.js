import API from "./api";

export const getAttendanceShifts = async () => {
    return await API.get("/attendance-shifts-info");
};

export const getAttendanceShift = async (id) => {
    return await API.get(`/attendance-shifts-info/${id}`);
};

export const addAttendanceShift = async (data) => {
    return await API.post("/attendance-shifts-info", data);
};

export const updateAttendanceShift = async (id, data) => {
    return await API.put(`/attendance-shifts-info/${id}`, data);
};

export const deleteAttendanceShift = async (id) => {
    return await API.delete(`/attendance-shifts-info/${id}`);
};
