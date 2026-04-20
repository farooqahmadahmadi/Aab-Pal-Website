import { useEffect } from "react";
import RouteIndex from "./routes/index";
import UpdateNotifier from "./components/PWA/UpdateNotifier";

function App() {

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
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