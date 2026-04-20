import { useRegisterSW } from "virtual:pwa-register/react";
import { useState, useEffect } from "react";

export default function UpdateNotifier() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      setShow(true);
      setProgress(100);
    },
  });

  // ⏱ countdown + progress
  useEffect(() => {
    if (!show) return;

    let time = 8000; // 5 sec
    const interval = 50;

    const timer = setInterval(() => {
      time -= interval;
      setProgress((time / 8000) * 100);

      if (time <= 0) {
        clearInterval(timer);
        setShow(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 
    bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl z-50 
    w-[90%] max-w-sm animate-fadeIn"
    >
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-600 rounded mb-2 overflow-hidden">
        <div
          className="h-1 bg-green-400 transition-all duration-50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm mb-2 text-center sm:text-left">
        New version available
      </p>

      <div className="flex justify-center sm:justify-end gap-2">
        <button
          onClick={() => setShow(false)}
          className="px-3 py-1 bg-gray-500/70 rounded hover:bg-gray-600 text-sm"
        >
          Later
        </button>

        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-sm animate-bounce"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
