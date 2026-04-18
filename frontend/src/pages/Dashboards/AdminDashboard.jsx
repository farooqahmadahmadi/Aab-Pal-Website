import UsersPieCard from "./AdminDashboard/UsersPieCard";
import EmployeeBarCard from "./AdminDashboard/EmployeeBarCard";
import EmpHiringBarCard from "./AdminDashboard/EmpHiringBarCard";
import EmployeeAttendanceChart from "./AdminDashboard/EmployeeAttendanceChart";

import ClientsPieCard from "./AdminDashboard/ClientsPieCard";
import ProjectBarCard from "./AdminDashboard/ProjectBarCard";
import ProjectTimelineChart from "./AdminDashboard/ProjectTimelineChart";

import ExpensesBarCard from "./AdminDashboard/ExpensesBarCard";
import ExpensesPieCard from "./AdminDashboard/ExpensesPieCard";
import CashTransactionsChart from "./AdminDashboard/CashTransactionsChart";

export default function AdminDashboard() {
  return (
    <div className="p-4">
      {/* DASHBOARD GRID */}
      <div
        className="grid gap-3 
        grid-cols-1
        sm:grid-cols-2 
        lg:grid-cols-3"
      >
        <UsersPieCard />
        <EmployeeBarCard />
        <EmpHiringBarCard />
        <EmployeeAttendanceChart />

        <ClientsPieCard />
        <ProjectBarCard />
        <ProjectTimelineChart />

        <ExpensesBarCard />
        <ExpensesPieCard />
        <CashTransactionsChart />
      </div>
    </div>
  );
}
