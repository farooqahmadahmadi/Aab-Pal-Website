
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EmployeeLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="Employee" />
            <div className="flex-1 flex flex-col">
                <Navbar role="Employee" />
                <main className="p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
