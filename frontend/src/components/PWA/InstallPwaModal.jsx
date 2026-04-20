import { useEffect, useState } from "react";

export default function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShow(false);
    }
  }, []);

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
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center">
        <h2 className="text-lg font-bold mb-2">Install Application</h2>

        <p className="text-gray-600 text-sm mb-4">
          Install this app for better performance and offline access.
        </p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Later
          </button>

          <button
            onClick={installApp}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
