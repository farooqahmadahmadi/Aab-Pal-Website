import API from "./api";

export const getSettings = () => API.get("/system-settings");
export const updateSetting = (data) => API.put("/system-settings", data);
