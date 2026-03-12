import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar/Sidebar";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/footer/Footer";

export default function ClientLayout() {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar role="client" />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar role="client" />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}