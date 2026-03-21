import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function HRLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="HR" />
            <div className="flex-1 flex flex-col">
                <Navbar role="HR" />
                <main className="p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}