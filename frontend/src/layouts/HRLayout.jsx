import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar/Sidebar";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/footer/Footer";

export default function HRLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="hr" />
      <div className="flex-1 flex flex-col">
        <Navbar role="hr" />
        <main className="p-6 bg-gray-100 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}