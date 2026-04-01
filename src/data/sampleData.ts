// Sample data for SiteSync - Samarth Developers, Nashik

export const sites = [
  { id: "site-a", name: "Samarth Residency — Tower A", shortName: "Tower A" },
  { id: "site-b", name: "Samarth Residency — Tower B", shortName: "Tower B" },
  { id: "site-c", name: "Samarth Commerce Park", shortName: "Commerce Park" },
];

export interface DailyWorker {
  id: string;
  name: string;
  role: string;
  dailyRate: number;
  daysPresent: number;
  amountDue: number;
  status: "Paid" | "Pending";
  site: string;
  phone: string;
}

export const dailyWorkers: DailyWorker[] = [
  { id: "w1", name: "Ramesh Patil", role: "Mason", dailyRate: 650, daysPresent: 6, amountDue: 3900, status: "Pending", site: "site-a", phone: "9876543210" },
  { id: "w2", name: "Suresh Jadhav", role: "Helper", dailyRate: 500, daysPresent: 5, amountDue: 2500, status: "Pending", site: "site-a", phone: "9876543211" },
  { id: "w3", name: "Ganesh Shinde", role: "Carpenter", dailyRate: 700, daysPresent: 6, amountDue: 4200, status: "Paid", site: "site-b", phone: "9876543212" },
  { id: "w4", name: "Dinesh Pawar", role: "Plumber", dailyRate: 750, daysPresent: 4, amountDue: 3000, status: "Pending", site: "site-b", phone: "9876543213" },
  { id: "w5", name: "Santosh Gaikwad", role: "Electrician", dailyRate: 800, daysPresent: 6, amountDue: 4800, status: "Paid", site: "site-c", phone: "9876543214" },
  { id: "w6", name: "Manoj Deshmukh", role: "Mason", dailyRate: 650, daysPresent: 5, amountDue: 3250, status: "Pending", site: "site-a", phone: "9876543215" },
  { id: "w7", name: "Rajesh More", role: "Helper", dailyRate: 500, daysPresent: 6, amountDue: 3000, status: "Pending", site: "site-b", phone: "9876543216" },
  { id: "w8", name: "Anil Gaikwad", role: "Painter", dailyRate: 600, daysPresent: 5, amountDue: 3000, status: "Paid", site: "site-c", phone: "9876543217" },
  { id: "w9", name: "Prakash Wagh", role: "Mason", dailyRate: 650, daysPresent: 6, amountDue: 3900, status: "Pending", site: "site-a", phone: "9876543218" },
  { id: "w10", name: "Vijay Bhosale", role: "Helper", dailyRate: 500, daysPresent: 4, amountDue: 2000, status: "Pending", site: "site-a", phone: "9876543219" },
  { id: "w11", name: "Sachin Kale", role: "Carpenter", dailyRate: 700, daysPresent: 5, amountDue: 3500, status: "Paid", site: "site-b", phone: "9876543220" },
  { id: "w12", name: "Nitin Pawar", role: "Welder", dailyRate: 750, daysPresent: 6, amountDue: 4500, status: "Pending", site: "site-c", phone: "9876543221" },
];

export interface MonthlyStaff {
  id: string;
  name: string;
  designation: string;
  monthlySalary: number;
  status: "Paid" | "Pending";
  site: string;
}

export const monthlyStaff: MonthlyStaff[] = [
  { id: "s1", name: "Rahul Deshmukh", designation: "Site Engineer", monthlySalary: 35000, status: "Paid", site: "site-a" },
  { id: "s2", name: "Vijay Kulkarni", designation: "Supervisor", monthlySalary: 28000, status: "Paid", site: "site-b" },
  { id: "s3", name: "Priya Sharma", designation: "Accountant", monthlySalary: 25000, status: "Paid", site: "site-a" },
  { id: "s4", name: "Amol Joshi", designation: "Site Engineer", monthlySalary: 35000, status: "Pending", site: "site-c" },
  { id: "s5", name: "Sneha Patil", designation: "Store Keeper", monthlySalary: 18000, status: "Paid", site: "site-b" },
  { id: "s6", name: "Kiran Mahale", designation: "Supervisor", monthlySalary: 28000, status: "Pending", site: "site-a" },
];

export interface Material {
  id: string;
  name: string;
  supplier: string;
  quantity: number;
  unit: string;
  rate: number;
  status: "Sufficient" | "Low" | "Critical";
  site: string;
}

export const materials: Material[] = [
  { id: "m1", name: "OPC Cement (53 Grade)", supplier: "Nashik Cement Agency", quantity: 450, unit: "bags", rate: 380, status: "Sufficient", site: "site-a" },
  { id: "m2", name: "TMT Steel 12mm", supplier: "Shree Steel Traders", quantity: 2200, unit: "kg", rate: 58, status: "Sufficient", site: "site-a" },
  { id: "m3", name: "Red Bricks", supplier: "Patil Brick Suppliers", quantity: 15000, unit: "pieces", rate: 8, status: "Sufficient", site: "site-b" },
  { id: "m4", name: "River Sand", supplier: "Godavari Sand Suppliers", quantity: 8, unit: "brass", rate: 1800, status: "Low", site: "site-a" },
  { id: "m5", name: "Aggregates 20mm", supplier: "Nashik Stone Crushers", quantity: 12, unit: "tonnes", rate: 1200, status: "Sufficient", site: "site-c" },
  { id: "m6", name: "PPC Cement", supplier: "Nashik Cement Agency", quantity: 45, unit: "bags", rate: 360, status: "Critical", site: "site-b" },
  { id: "m7", name: "TMT Steel 8mm", supplier: "Shree Steel Traders", quantity: 800, unit: "kg", rate: 62, status: "Low", site: "site-c" },
  { id: "m8", name: "Plywood 18mm", supplier: "Nashik Plywood Mart", quantity: 25, unit: "sheets", rate: 1450, status: "Low", site: "site-a" },
  { id: "m9", name: "Electrical Wire 2.5mm", supplier: "Kulkarni Electricals", quantity: 500, unit: "meters", rate: 22, status: "Sufficient", site: "site-b" },
  { id: "m10", name: "PVC Pipes 4 inch", supplier: "Nashik Pipe Center", quantity: 15, unit: "pieces", rate: 380, status: "Critical", site: "site-c" },
];

export interface Supplier {
  id: string;
  name: string;
  material: string;
  contact: string;
  totalBusiness: number;
  rating: number;
}

export const suppliers: Supplier[] = [
  { id: "sup1", name: "Nashik Cement Agency", material: "Cement", contact: "9823456710", totalBusiness: 342000, rating: 4.5 },
  { id: "sup2", name: "Shree Steel Traders", material: "TMT Steel", contact: "9823456720", totalBusiness: 578000, rating: 4.2 },
  { id: "sup3", name: "Patil Brick Suppliers", material: "Bricks", contact: "9823456730", totalBusiness: 120000, rating: 4.0 },
  { id: "sup4", name: "Godavari Sand Suppliers", material: "River Sand", contact: "9823456740", totalBusiness: 234000, rating: 3.8 },
  { id: "sup5", name: "Nashik Stone Crushers", material: "Aggregates", contact: "9823456750", totalBusiness: 156000, rating: 4.3 },
  { id: "sup6", name: "Nashik Plywood Mart", material: "Plywood", contact: "9823456760", totalBusiness: 87000, rating: 4.1 },
  { id: "sup7", name: "Kulkarni Electricals", material: "Electrical", contact: "9823456770", totalBusiness: 65000, rating: 4.6 },
  { id: "sup8", name: "Nashik Pipe Center", material: "Plumbing", contact: "9823456780", totalBusiness: 48000, rating: 3.9 },
];

export interface Invoice {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  site: string;
  status: "Paid" | "Pending";
  description: string;
}

export const invoices: Invoice[] = [
  { id: "inv1", supplier: "Nashik Cement Agency", date: "2026-03-28", amount: 171000, site: "site-a", status: "Paid", description: "450 bags OPC Cement" },
  { id: "inv2", supplier: "Shree Steel Traders", date: "2026-03-27", amount: 127600, site: "site-a", status: "Pending", description: "2200 kg TMT 12mm" },
  { id: "inv3", supplier: "Patil Brick Suppliers", date: "2026-03-25", amount: 120000, site: "site-b", status: "Paid", description: "15000 Red Bricks" },
  { id: "inv4", supplier: "Godavari Sand Suppliers", date: "2026-03-24", amount: 14400, site: "site-a", status: "Pending", description: "8 brass River Sand" },
  { id: "inv5", supplier: "Nashik Stone Crushers", date: "2026-03-22", amount: 14400, site: "site-c", status: "Paid", description: "12 tonnes Aggregates" },
  { id: "inv6", supplier: "Nashik Cement Agency", date: "2026-03-20", amount: 16200, site: "site-b", status: "Pending", description: "45 bags PPC Cement" },
  { id: "inv7", supplier: "Kulkarni Electricals", date: "2026-03-18", amount: 11000, site: "site-b", status: "Paid", description: "500m Wire 2.5mm" },
  { id: "inv8", supplier: "Nashik Plywood Mart", date: "2026-03-15", amount: 36250, site: "site-a", status: "Pending", description: "25 sheets 18mm Plywood" },
  { id: "inv9", supplier: "Shree Steel Traders", date: "2026-03-12", amount: 49600, site: "site-c", status: "Paid", description: "800 kg TMT 8mm" },
  { id: "inv10", supplier: "Nashik Pipe Center", date: "2026-03-10", amount: 5700, site: "site-c", status: "Pending", description: "15 PVC Pipes 4 inch" },
];

export interface Alert {
  id: string;
  type: "stock" | "budget" | "payment";
  title: string;
  description: string;
  urgency: "high" | "medium" | "low";
  date: string;
  site: string;
}

export const alerts: Alert[] = [
  { id: "a1", type: "budget", title: "Budget Overrun Warning", description: "Tower A spending is 12% over budget. At current rate, will exceed by ₹2.3 lakhs in 18 days.", urgency: "high", date: "2026-03-31", site: "site-a" },
  { id: "a2", type: "stock", title: "PPC Cement — Critical Stock", description: "Only 45 bags remaining at Tower B. Estimated 2 days of stock left.", urgency: "high", date: "2026-03-31", site: "site-b" },
  { id: "a3", type: "stock", title: "PVC Pipes — Critical Stock", description: "Only 15 pieces at Commerce Park. Plumbing work may halt.", urgency: "high", date: "2026-03-30", site: "site-c" },
  { id: "a4", type: "payment", title: "Pending Supplier Payment", description: "₹1,27,600 pending to Shree Steel Traders for 5 days.", urgency: "medium", date: "2026-03-30", site: "site-a" },
  { id: "a5", type: "stock", title: "River Sand — Low Stock", description: "Only 8 brass remaining. Reorder recommended.", urgency: "medium", date: "2026-03-29", site: "site-a" },
  { id: "a6", type: "payment", title: "Worker Payments Due Friday", description: "₹37,550 cash required for 12 daily workers this Friday.", urgency: "medium", date: "2026-03-29", site: "site-a" },
  { id: "a7", type: "stock", title: "TMT Steel 8mm — Low Stock", description: "800 kg remaining at Commerce Park. May need reorder next week.", urgency: "low", date: "2026-03-28", site: "site-c" },
  { id: "a8", type: "budget", title: "Monthly Expense Tracking", description: "Total March spending: ₹18.4 lakhs across all sites.", urgency: "low", date: "2026-03-28", site: "site-a" },
];

export const recentActivity = [
  { text: "Ramesh Patil marked present at Tower A", time: "10 min ago", icon: "attendance" as const },
  { text: "450 bags OPC Cement delivered to Tower A", time: "2 hours ago", icon: "delivery" as const },
  { text: "₹1,20,000 paid to Patil Brick Suppliers", time: "5 hours ago", icon: "payment" as const },
  { text: "Ganesh Shinde marked paid — ₹4,200", time: "Yesterday", icon: "payment" as const },
  { text: "PPC Cement stock critical at Tower B", time: "Yesterday", icon: "alert" as const },
  { text: "New delivery challan uploaded — River Sand", time: "2 days ago", icon: "delivery" as const },
];

export const financeData = {
  budgets: [
    { site: "Tower A", budget: 4500000, actual: 5040000 },
    { site: "Tower B", budget: 3800000, actual: 3420000 },
    { site: "Commerce Park", budget: 2800000, actual: 2660000 },
  ],
  weeklyPayments: [
    { week: "Week 1", workers: 185000, suppliers: 342000 },
    { week: "Week 2", workers: 192000, suppliers: 278000 },
    { week: "Week 3", workers: 178000, suppliers: 456000 },
    { week: "Week 4", workers: 195000, suppliers: 312000 },
  ],
  expenseBreakdown: [
    { category: "Labor — Daily", amount: 750000, color: "#1B3A6B" },
    { category: "Labor — Monthly", amount: 380000, color: "#2D5AA0" },
    { category: "Cement & Steel", amount: 520000, color: "#FF6B35" },
    { category: "Bricks & Sand", amount: 280000, color: "#FFA366" },
    { category: "Electrical & Plumbing", amount: 145000, color: "#4A90D9" },
    { category: "Other Materials", amount: 95000, color: "#7FB3E0" },
  ],
};

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function formatINRLakhs(amount: number): string {
  if (amount >= 10000000) {
    return "₹" + (amount / 10000000).toFixed(1) + " Cr";
  }
  if (amount >= 100000) {
    return "₹" + (amount / 100000).toFixed(1) + " L";
  }
  return formatINR(amount);
}
