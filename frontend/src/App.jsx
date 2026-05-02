import { useEffect } from "react";
import RouteIndex from "./routes/index";
import UpdateNotifier from "./components/PWA/UpdateNotifier";

function App() {
  useEffect(() => {
    // Ask notification permission once
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <RouteIndex />
      <UpdateNotifier />
    </>
  );
}

export default App;