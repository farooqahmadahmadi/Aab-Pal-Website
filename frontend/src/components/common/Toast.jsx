import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto close after 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    // Base background color
    const bg =
        type === "success"
            ? "bg-green-500"
            : type === "error"
                ? "bg-red-500"
                : "bg-blue-500";

    return (
        <div className="fixed top-[35%] right-1/3 left-1/3 z-50 flex justify-center items-center">

            {/* Animated gradient border */}
            <div className="relative rounded-xl p-[2px]">
                <div className="absolute inset-0 rounded-xl blur-xl opacity-80 animate-gradient-move bg-gradient-to-r from-pink-500 via-red-500 via-yellow-400 via-green-400 via-blue-500 via-indigo-500 via-purple-500"></div>

                {/* Toast content */}
                <div className={`relative px-6 py-3 rounded-xl text-xl text-white shadow-2xl transform animate-pulse-toast ${bg}`}>
                    {message}
                </div>
            </div>

            <style>
                {`
          @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes pulseToast {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .animate-gradient-move {
            background-size: 400% 400%;
            animation: gradientMove 6s ease-in-out infinite;
          }

          .animate-pulse-toast {
            animation: pulseToast 2s ease-in-out infinite;
          }
        `}
            </style>
        </div>
    );
}