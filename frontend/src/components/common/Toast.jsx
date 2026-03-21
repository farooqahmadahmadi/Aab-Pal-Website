import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bg =
        type === "success"
            ? "bg-green-500"
            : type === "error"
                ? "bg-red-500"
                : "bg-blue-500";

    return (
        <div className={`fixed top-[50%] right-[36%] left-[36%] z-50 px-4 py-3 text-center text-xl rounded text-white shadow-lg ${bg}`}>
            {message}
        </div>
    );
}
