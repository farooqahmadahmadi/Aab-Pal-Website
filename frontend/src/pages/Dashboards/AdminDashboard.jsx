import UsersPieCard from "./AdminDashboard/UsersPieCard";
import EmployeeBarCard from "./AdminDashboard/EmployeeBarCard";
import EmpHiringBarCard from "./AdminDashboard/EmpHiringBarCard";
import ExpensesBarCard from "./AdminDashboard/ExpensesBarCard";
import ExpensesPieCard from "./AdminDashboard/ExpensesPieCard";

export default function AdminDashboard() {
  return (
    <div className="p-4">
      {/* DASHBOARD GRID */}
      <div
        className="grid gap-2 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3"
      >
        <UsersPieCard />
        <EmployeeBarCard />
        <EmpHiringBarCard />
        <ExpensesBarCard />
        <ExpensesPieCard />
      </div>
    </div>
  );
}
