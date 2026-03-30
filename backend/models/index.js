const sequelize = require('../config/db');
const CompanyInfo = require('./CompanyInfo');
const CompanyDocument = require('./CompanyDocument');
const EmployeeInfo = require('./EmployeeInfo');
const EmployeeDocuments = require('./EmployeeDocuments');
const EmployeeEducationalInfo = require('./EmployeeEducationalInfo');
const EmpSalaryInfo = require('./EmpSalaryInfo');
const EmpHiringInfo = require('./EmpHiringInfo');
const EmpAttendanceInfo = require('./EmpAttendanceInfo');
// const EmpAttendSummaryInfo = require('./EmpAttendSummaryInfo');
const AttendanceShiftsInfo = require('./AttendanceShiftsInfo');
const DepartmentInfo = require('./DepartmentInfo');
const EmpSalaryPaymentInfo = require('./EmpSalaryPaymentInfo');
const ProjectInfo = require('./ProjectInfo');
const ClientInfo = require('./ClientInfo');
const ProjectPhasesInfo = require('./ProjectPhasesInfo');
const ProjectDocuments = require('./ProjectDocuments');
const EquipmentInfo = require('./EquipmentInfo');
const EquipmentUsageInfo = require('./EquipmentUsageInfo');
const EquipmentMaintenanceInfo = require('./EquipmentMaintenanceInfo');
const EquipmentDocuments = require('./EquipmentDocuments');
const MaterialInfo = require('./MaterialsInfo');
const PurchaseOrderItemInfo = require('./PurchaseOrderItemsInfo');
// const StockTransactionInfo = require('./StockTransactionsInfo');
const SupplierInfo = require('./SuppliersInfo');
const PurchaseOrdersInfo = require('./PurchaseOrdersInfo');
const ContractInfo = require('./ContractInfo');
const ContractMilestonesInfo = require('./ContractMilestonesInfo');
const BoqItemsInfo = require('./BoqItemsInfo');
const TasksAssignmentInfo = require('./TasksAssignmentInfo');
const SiteDailyReportsInfo = require('./SiteDailyReportsInfo');
const SafetyIncidentsInfo = require('./SafetyIncidentsInfo');
const ExpensesInfo = require('./ExpensesInfo');
const CashTransactionsInfo = require('./CashTransactionsInfo');
const InvoicesInfo = require('./InvoicesInfo');
const PaymentsInfo = require('./PaymentsInfo');
const Users = require('./Users');
const Notifications = require('./Notifications');
const SystemLogs = require('./SystemLogs');

/* 01 -----------------------------------------------------------------------------
Core Company Models Associations*/
// Company to Company Documents
CompanyInfo.hasMany(CompanyDocument, { foreignKey: 'company_id' });
CompanyDocument.belongsTo(CompanyInfo, { foreignKey: 'company_id' });


/* 02 -----------------------------------------------------------------------------
HR Models Associations*/
// Employee to Documents
EmployeeInfo.hasMany(EmployeeDocuments, { foreignKey: 'employee_id' });
EmployeeDocuments.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Employee to Educational Info
EmployeeInfo.hasMany(EmployeeEducationalInfo, { foreignKey: 'employee_id' });
EmployeeEducationalInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Employee to Salary Info
EmployeeInfo.hasMany(EmpSalaryInfo, { foreignKey: 'employee_id' });
EmpSalaryInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Employee to Hiring Info
EmployeeInfo.hasMany(EmpHiringInfo, { foreignKey: 'employee_id' });
EmpHiringInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Employee to Attendance Info
EmployeeInfo.hasMany(EmpAttendanceInfo, { foreignKey: 'employee_id' });
EmpAttendanceInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Employee to Attendance Summary Info
// EmployeeInfo.hasMany(EmpAttendSummaryInfo, { foreignKey: 'employee_id' });
// EmpAttendSummaryInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// AttendanceShift to Hiring Info
AttendanceShiftsInfo.hasMany(EmpHiringInfo, { foreignKey: 'attendance_shift_id' });
EmpHiringInfo.belongsTo(AttendanceShiftsInfo, { foreignKey: 'attendance_shift_id' });

// Department to Hiring Info
DepartmentInfo.hasMany(EmpHiringInfo, { foreignKey: 'department_id' });
EmpHiringInfo.belongsTo(DepartmentInfo, { foreignKey: 'department_id' });

// Salary to Payment Info
EmpSalaryInfo.hasMany(EmpSalaryPaymentInfo, { foreignKey: 'employee_salary_id' });
EmpSalaryPaymentInfo.belongsTo(EmpSalaryInfo, { foreignKey: 'employee_salary_id' });

// Attendance Summary to Payment Info
// EmpAttendSummaryInfo.hasMany(EmpSalaryPaymentInfo, { foreignKey: 'attend_summary_id' });
// EmpSalaryPaymentInfo.belongsTo(EmpAttendSummaryInfo, { foreignKey: 'attend_summary_id' });


/* 03 -----------------------------------------------------------------------------
Project Models Associations*/
// Client to Project
ClientInfo.hasMany(ProjectInfo, { foreignKey: 'client_id' });
ProjectInfo.belongsTo(ClientInfo, { foreignKey: 'client_id' });

// Employee to Project (As Project Member)
EmployeeInfo.hasMany(ProjectInfo, { foreignKey: 'employee_id' });
ProjectInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Project to Phases
ProjectInfo.hasMany(ProjectPhasesInfo, { foreignKey: 'project_id' });
ProjectPhasesInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Project to Documents
ProjectInfo.hasMany(ProjectDocuments, { foreignKey: 'project_id' });
ProjectDocuments.belongsTo(ProjectInfo, { foreignKey: 'project_id' });


/* 04 -----------------------------------------------------------------------------
Equipment Models Associations*/
// Equipment to Maintenance Info
EquipmentInfo.hasMany(EquipmentMaintenanceInfo, { foreignKey: 'equipment_id' });
EquipmentMaintenanceInfo.belongsTo(EquipmentInfo, { foreignKey: 'equipment_id' });

// Equipment to Equipment Usage Info
EquipmentInfo.hasMany(EquipmentUsageInfo, { foreignKey: 'equipment_id' });
EquipmentUsageInfo.belongsTo(EquipmentInfo, { foreignKey: 'equipment_id' });

// Equipment to Equipment Documents Info
EquipmentInfo.hasMany(EquipmentDocuments, { foreignKey: 'equipment_id' });
EquipmentDocuments.belongsTo(EquipmentInfo, { foreignKey: 'equipment_id' });

// Employee to Equipment Usage Info
EmployeeInfo.hasMany(EquipmentUsageInfo, { foreignKey: 'employee_id' });
EquipmentUsageInfo.belongsTo(EmployeeInfo, { foreignKey: 'employee_id' });

// Project to Equipment Usage Info
ProjectInfo.hasMany(EquipmentUsageInfo, { foreignKey: 'project_id' });
EquipmentUsageInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });


/* 05 -----------------------------------------------------------------------------
Materials & Inventory Models Associations*/
// Materials Info to Purchase Order Items Info
MaterialInfo.hasMany(PurchaseOrderItemInfo, { foreignKey: 'material_id' });
PurchaseOrderItemInfo.belongsTo(MaterialInfo, { foreignKey: 'material_id' });

// Materials Info to Stock Transactions Info
// MaterialInfo.hasMany(StockTransactionInfo, { foreignKey: 'material_id' });
// StockTransactionInfo.belongsTo(MaterialInfo, { foreignKey: 'material_id' });

// Suppliers Info to Purchase Orders Info
SupplierInfo.hasMany(PurchaseOrdersInfo, { foreignKey: 'supplier_id' });
PurchaseOrdersInfo.belongsTo(SupplierInfo, { foreignKey: 'supplier_id' });

// Purchase Orders Info to Purchase Order Items Info
PurchaseOrdersInfo.hasMany(PurchaseOrderItemInfo, { foreignKey: 'po_id' });
PurchaseOrderItemInfo.belongsTo(PurchaseOrdersInfo, { foreignKey: 'po_id' });

// Project Info to Purchase Orders Info
ProjectInfo.hasMany(PurchaseOrdersInfo, { foreignKey: 'project_id' });
PurchaseOrdersInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Project Info to Stock Transactions Info
// ProjectInfo.hasMany(StockTransactionInfo, { foreignKey: 'project_id' });
// StockTransactionInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });


/* 06 -----------------------------------------------------------------------------
Contract Management Models Associations*/
// Project to Contract
ProjectInfo.hasMany(ContractInfo, { foreignKey: 'project_id' });
ContractInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Contract to Milestones
ContractInfo.hasMany(ContractMilestonesInfo, { foreignKey: 'contract_id' });
ContractMilestonesInfo.belongsTo(ContractInfo, { foreignKey: 'contract_id' });


/* 07 -----------------------------------------------------------------------------
Bill of Quantities Models Associations*/
// Project to BOQ Items
ProjectInfo.hasMany(BoqItemsInfo, { foreignKey: 'project_id' });
BoqItemsInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });


/* 08 -----------------------------------------------------------------------------
Tasks Assignment Models Associations*/
// Project to Tasks Assignment
ProjectInfo.hasMany(TasksAssignmentInfo, { foreignKey: 'project_id' });
TasksAssignmentInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Employee to Tasks Assignment
EmployeeInfo.hasMany(TasksAssignmentInfo, { foreignKey: 'assigned_to' });
TasksAssignmentInfo.belongsTo(EmployeeInfo, { foreignKey: 'assigned_to' });


/* 09 -----------------------------------------------------------------------------
Site Daily Reports Models Associations*/
// Project to Daily Reports
ProjectInfo.hasMany(SiteDailyReportsInfo, { foreignKey: 'project_id' });
SiteDailyReportsInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Employee to Daily Reports
EmployeeInfo.hasMany(SiteDailyReportsInfo, { foreignKey: 'prepared_by' });
SiteDailyReportsInfo.belongsTo(EmployeeInfo, { foreignKey: 'prepared_by' });


/* 10 -----------------------------------------------------------------------------
Safety Incidents Models Associations*/
// Project to Safety Incidents
ProjectInfo.hasMany(SafetyIncidentsInfo, { foreignKey: 'project_id' });
SafetyIncidentsInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });


/* 11 -----------------------------------------------------------------------------
Financial Models Associations*/
// Project to Expenses Info
ProjectInfo.hasMany(ExpensesInfo, { foreignKey: 'project_id' });
ExpensesInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Project to Cash Transactions Info
ProjectInfo.hasMany(CashTransactionsInfo, { foreignKey: 'project_id' });
CashTransactionsInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Project to Invoices Info
ProjectInfo.hasMany(InvoicesInfo, { foreignKey: 'project_id' });
InvoicesInfo.belongsTo(ProjectInfo, { foreignKey: 'project_id' });

// Client to Invoices Info
ClientInfo.hasMany(InvoicesInfo, { foreignKey: 'client_id' });
InvoicesInfo.belongsTo(ClientInfo, { foreignKey: 'client_id' });

// Invoice to Payments Info
InvoicesInfo.hasMany(PaymentsInfo, { foreignKey: 'invoice_id' });
PaymentsInfo.belongsTo(InvoicesInfo, { foreignKey: 'invoice_id' });


/* 12 -----------------------------------------------------------------------------
User Models Associations*/
// Client to Users
ClientInfo.hasOne(Users, { foreignKey: 'client_id' });
Users.belongsTo(ClientInfo, { foreignKey: 'client_id' });


/* 13 -----------------------------------------------------------------------------
User Models Associations*/
// Users to Notifications
Users.hasMany(Notifications, { foreignKey: 'user_id' });
Notifications.belongsTo(Users, { foreignKey: 'user_id' });

// Users to System Logs
Users.hasMany(SystemLogs, { foreignKey: 'user_id' });
SystemLogs.belongsTo(Users, { foreignKey: 'user_id' });



module.exports = {
    sequelize,
    CompanyInfo,
    CompanyDocument,
    EmployeeInfo,
    EmployeeDocuments,
    EmployeeEducationalInfo,
    EmpSalaryInfo,
    EmpHiringInfo,
    EmpAttendanceInfo,
    AttendanceShiftsInfo,
    DepartmentInfo,
    EmpSalaryPaymentInfo,
    ProjectInfo,
    ClientInfo,
    ProjectPhasesInfo,
    ProjectDocuments,
    EquipmentInfo,
    EquipmentUsageInfo,
    EquipmentMaintenanceInfo,
    EquipmentDocuments,
    MaterialInfo,
    PurchaseOrderItemInfo,
    SupplierInfo,
    PurchaseOrdersInfo,
    ContractInfo,
    ContractMilestonesInfo,
    BoqItemsInfo,
    TasksAssignmentInfo,
    SiteDailyReportsInfo,
    SafetyIncidentsInfo,
    ExpensesInfo,
    CashTransactionsInfo,
    InvoicesInfo,
    PaymentsInfo,
    Users,
    Notifications,
    SystemLogs
};