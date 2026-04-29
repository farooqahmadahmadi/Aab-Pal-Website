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
import FinanceCard from "./AdminDashboard/FinanceCard";
import AttendanceSummaryCard from "./AdminDashboard/AttendanceSummaryCard";
import ProjectsSummaryCard from "./AdminDashboard/ProjectsSummaryCard";
import ClientsSummaryCard from "./AdminDashboard/ClientsSummaryCard";
export default function AdminDashboard() {
  return (
    <div className="p-4 pt-0.5">
      <div
        className="grid gap-3 pb-3
        grid-cols-1
        sm:grid-cols-2 
        lg:grid-cols-4"
      >
        <AttendanceSummaryCard />
        <FinanceCard />
        <ClientsSummaryCard />
        <ProjectsSummaryCard />
      </div>
      {/* DASHBOARD GRID */}
      <div
        className="grid gap-3 
        grid-cols-1
        sm:grid-cols-1 
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
      </div>
      <div
        className="grid gap-3 pt-3 pb-2
        grid-cols-1
        sm:grid-cols-1 
        lg:grid-cols-1"
      >
        <CashTransactionsChart />
      </div>
    </div>
  );
}
