import React, { useEffect, useState } from "react";
import { checkIn, checkOut, getAttendance } from "../../services/employeeAttendanceService";
import Toast from "../../components/common/Toast";
import attendanceImage from '../../assets/images/attendance-bg.jpg';

export default function EmployeeAttendance() {
    const [attendance, setAttendance] = useState(null);
    const [timer, setTimer] = useState("00:00:00");
    const [loading, setLoading] = useState(false);
    const [shiftInfo, setShiftInfo] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    const getLocation = () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                pos =>
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }),
                err => reject(err)
            );
        });

    const fetchToday = async () => {
        const res = await getAttendance();
        const today = new Date().toISOString().slice(0, 10);
        const record = res.data.find(r => r.attendance_date === today);
        setAttendance(record || null);
        if (record?.shift) setShiftInfo(record.shift);
    };

    useEffect(() => { fetchToday(); }, []);

    // Timer
    useEffect(() => {
        let interval;
        if (attendance?.check_in_time && !attendance?.check_out_time) {
            interval = setInterval(() => {
                const now = new Date();
                const [h, m, s] = attendance.check_in_time.split(":");
                const start = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    parseInt(h),
                    parseInt(m),
                    parseInt(s)
                );
                const diff = now - start;
                const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
                const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
                const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
                setTimer(`${hours}:${minutes}:${seconds}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [attendance]);

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            const loc = await getLocation();
            await checkIn(loc);
            setToastMsg({ type: "success", message: "Checked in successfully!" });
            await fetchToday();
        } catch (err) {
            setToastMsg({ type: "error", message: err?.response?.data?.message || "Check-in failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            const loc = await getLocation();
            await checkOut(loc);
            setToastMsg({ type: "success", message: "Checked out successfully!" });
            await fetchToday();
        } catch (err) {
            setToastMsg({ type: "error", message: err?.response?.data?.message || "Check-out failed" });
        } finally {
            setLoading(false);
        }
    };

    // Shift logic
    const isCheckInEnabled = () => {
        if (!shiftInfo) return true;
        const now = new Date();
        const [startH, startM] = shiftInfo.check_in_start.split(":").map(Number);
        const [endH, endM] = shiftInfo.check_in_end.split(":").map(Number);
        const start = new Date(now); start.setHours(startH, startM, 0);
        const end = new Date(now); end.setHours(endH, endM, 59);
        return now >= start && now <= end && !attendance?.check_in_time;
    };

    const isCheckOutEnabled = () => {
        if (!shiftInfo) return true;
        const now = new Date();
        const [startH, startM] = shiftInfo.check_out_start.split(":").map(Number);
        const [endH, endM] = shiftInfo.check_out_end.split(":").map(Number);
        const start = new Date(now); start.setHours(startH, startM, 0);
        const end = new Date(now); end.setHours(endH, endM, 59);
        return now >= start && now <= end && attendance?.check_in_time && !attendance?.check_out_time;
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 p-4">
            {toastMsg && <Toast type={toastMsg.type} message={toastMsg.message} onClose={() => setToastMsg(null)} />}

            <div className="relative w-96 bg-white rounded-xl shadow-xl overflow-hidden text-center">

                {/* Animated and Styled Top Image */}
                <div className="overflow-hidden relative">
                    <img
                        src={attendanceImage}
                        alt="Attendance"
                        className="w-full h-34 object-cover rounded-t-xl shadow-lg animate-slow-scale transition-transform duration-500 hover:scale-105"
                    />
                </div>

                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Attendance Checker</h2>

                    {/* Shift Info */}
                    {shiftInfo && (
                        <p className="text-gray-500 text-sm">
                            Shift: {shiftInfo.check_in_start} - {shiftInfo.check_out_end}
                        </p>
                    )}

                    {/* User Check-in/out times */}
                    <div className="flex justify-between font-semibold">
                        {attendance?.check_in_time && (
                            <p className="text-green-600 text-sm">
                                Checked in at: {attendance.check_in_time}
                            </p>
                        )}
                        {attendance?.check_out_time && (
                            <p className="text-red-500 text-sm">
                                Checked out at: {attendance.check_out_time}
                            </p>
                        )}
                    </div>
                    {/* Timer */}
                    {attendance?.check_in_time && !attendance?.check_out_time && (
                        <p className="text-blue-600 font-semibold text-lg">{timer}</p>
                    )}

                    {/* Buttons with Tooltip */}
                    <div className="relative">
                        <button
                            onClick={handleCheckIn}
                            disabled={loading || !isCheckInEnabled()}
                            className={`w-full py-2 mt-3 rounded text-white ${isCheckInEnabled() ? "bg-green-500 hover:bg-green-600" : "bg-green-300 cursor-not-allowed"}`}
                            title={shiftInfo ? `Check-in allowed: ${shiftInfo.check_in_start} - ${shiftInfo.check_in_end}` : ""}
                        >
                            {loading ? "Processing..." : "Check In"}
                        </button>

                        <button
                            onClick={handleCheckOut}
                            disabled={loading || !isCheckOutEnabled()}
                            className={`w-full py-2 mt-2 rounded text-white ${isCheckOutEnabled() ? "bg-red-500 hover:bg-red-600" : "bg-red-300 cursor-not-allowed"}`}
                            title={shiftInfo ? `Check-out allowed: ${shiftInfo.check_out_start} - ${shiftInfo.check_out_end}` : ""}
                        >
                            {loading ? "Processing..." : "Check Out"}
                        </button>
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes slow-scale {
                    0% { transform: scale(1) translateY(0px); }
                    50% { transform: scale(1.05) translateY(-5px); }
                    100% { transform: scale(1) translateY(0px); }
                }
                .animate-slow-scale {
                    animation: slow-scale 8s ease-in-out infinite;
                }
                `}
            </style>
        </div>
    );
}