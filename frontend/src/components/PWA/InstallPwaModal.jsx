import { useEffect, useState } from "react";

export default function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  // ================= CAPTURE INSTALL EVENT =================
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
      setProgress(100);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ================= AUTO HIDE + PROGRESS =================
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

  // ================= HIDE IF INSTALLED =================
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShow(false);
    }
  }, []);

  // ================= INSTALL ACTION =================
  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setShow(false);
    }

    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center animate-fadeIn">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded mb-3 overflow-hidden">
          <div
            className="h-1 bg-green-500 transition-all duration-50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-lg font-bold mb-2">Install Application</h2>

        <p className="text-gray-600 text-sm mb-4">
          Install this app for better performance and offline access.
        </p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Later
          </button>

          <button
            onClick={installApp}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition animate-bounce"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
