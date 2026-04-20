import { useRegisterSW } from "virtual:pwa-register/react";
import { useState } from "react";

export default function UpdateNotifier() {
  const [show, setShow] = useState(false);

  const {
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      setShow(true);
    },
  });

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2">New version available</p>

      <button
        onClick={() => updateServiceWorker(true)}
        className="bg-green-500 px-3 py-1 rounded"
      >
        Refresh
      </button>
    </div>
  );
}