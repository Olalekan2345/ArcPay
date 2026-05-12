export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rate: 1580 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.5 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', rate: 129 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rate: 4.97 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.34 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', rate: 3.67 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.5 },
]

export const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Marketing', 'Sales',
  'Finance', 'HR', 'Operations', 'Legal', 'Executive', 'Data Science',
]

export const PAYMENT_SCHEDULES = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly']

export const EMPLOYEE_ROLES = [
  'Full-time Employee', 'Part-time Employee', 'Contractor', 'Consultant', 'Intern',
]

export const MOCK_EMPLOYEES = [
  { id: '1', name: 'Sarah Chen', role: 'Senior Engineer', department: 'Engineering', salary: 8500, currency: 'USD', wallet: '0x1a2b3c4d5e6f', status: 'active', joinDate: '2023-01-15', location: 'San Francisco, US', avatar: 'SC', schedule: 'Monthly' },
  { id: '2', name: 'Marcus Johnson', role: 'Product Designer', department: 'Design', salary: 7200, currency: 'USD', wallet: '0x2b3c4d5e6f7a', status: 'active', joinDate: '2023-03-22', location: 'New York, US', avatar: 'MJ', schedule: 'Monthly' },
  { id: '3', name: 'Priya Sharma', role: 'Product Manager', department: 'Product', salary: 9000, currency: 'USD', wallet: '0x3c4d5e6f7a8b', status: 'active', joinDate: '2022-11-01', location: 'Bangalore, IN', avatar: 'PS', schedule: 'Monthly' },
  { id: '4', name: 'David Kim', role: 'Backend Engineer', department: 'Engineering', salary: 8000, currency: 'USD', wallet: '0x4d5e6f7a8b9c', status: 'active', joinDate: '2023-06-10', location: 'Seoul, KR', avatar: 'DK', schedule: 'Monthly' },
  { id: '5', name: 'Amara Osei', role: 'Marketing Lead', department: 'Marketing', salary: 6500, currency: 'USD', wallet: '0x5e6f7a8b9c0d', status: 'active', joinDate: '2023-08-20', location: 'Lagos, NG', avatar: 'AO', schedule: 'Monthly' },
  { id: '6', name: 'Lucas Oliveira', role: 'DevOps Engineer', department: 'Engineering', salary: 7800, currency: 'USD', wallet: '0x6f7a8b9c0d1e', status: 'pending', joinDate: '2024-01-05', location: 'São Paulo, BR', avatar: 'LO', schedule: 'Monthly' },
  { id: '7', name: 'Aiko Tanaka', role: 'Data Scientist', department: 'Data Science', salary: 8200, currency: 'USD', wallet: '0x7a8b9c0d1e2f', status: 'active', joinDate: '2023-09-15', location: 'Tokyo, JP', avatar: 'AT', schedule: 'Bi-weekly' },
  { id: '8', name: 'Emma Wilson', role: 'Head of HR', department: 'HR', salary: 7500, currency: 'USD', wallet: '0x8b9c0d1e2f3a', status: 'active', joinDate: '2022-08-01', location: 'London, UK', avatar: 'EW', schedule: 'Monthly' },
]

export const MOCK_PAYROLL_HISTORY = [
  { id: 'PAY-001', date: '2024-04-01', amount: 62700, employees: 8, status: 'pending', txHash: null, type: 'Monthly Payroll' },
  { id: 'PAY-002', date: '2024-03-01', amount: 55200, employees: 7, status: 'completed', txHash: '0xabc123def456789', type: 'Monthly Payroll' },
  { id: 'PAY-003', date: '2024-02-01', amount: 55200, employees: 7, status: 'completed', txHash: '0xbcd234ef567890a', type: 'Monthly Payroll' },
  { id: 'PAY-004', date: '2024-01-15', amount: 8500, employees: 1, status: 'completed', txHash: '0xcde345f678901b', type: 'Bonus Payment' },
  { id: 'PAY-005', date: '2024-01-01', amount: 48200, employees: 6, status: 'completed', txHash: '0xdef456a789012c', type: 'Monthly Payroll' },
]

export const MOCK_TREASURY = {
  totalBalance: 485000,
  usdcBalance: 425000,
  ethBalance: 15.8,
  pendingPayroll: 62700,
  monthlyBurn: 55200,
  runway: 8.5,
  monthlyChange: 3.2,
}

export const MOCK_JOBS = [
  { id: '1', title: 'Senior Full Stack Engineer', department: 'Engineering', type: 'Full-time', location: 'Remote', salary: '$120K–$160K', applicants: 24, status: 'active', posted: '2024-03-15' },
  { id: '2', title: 'Senior Product Designer', department: 'Design', type: 'Full-time', location: 'Remote', salary: '$100K–$130K', applicants: 18, status: 'active', posted: '2024-03-18' },
  { id: '3', title: 'Blockchain Engineer', department: 'Engineering', type: 'Contract', location: 'Remote', salary: '$150K–$200K', applicants: 11, status: 'active', posted: '2024-03-20' },
  { id: '4', title: 'Growth Marketing Manager', department: 'Marketing', type: 'Full-time', location: 'Hybrid', salary: '$90K–$120K', applicants: 31, status: 'closed', posted: '2024-02-10' },
]

export const MOCK_INVOICES = [
  { id: 'INV-001', client: 'Nexus Ventures', amount: 15000, currency: 'USDC', status: 'paid', due: '2024-03-15', issued: '2024-03-01', description: 'Development Services - Q1 2024' },
  { id: 'INV-002', client: 'Orbit Labs', amount: 8500, currency: 'USDC', status: 'pending', due: '2024-04-20', issued: '2024-03-20', description: 'Design Consulting Services' },
  { id: 'INV-003', client: 'Stellar Protocol', amount: 22000, currency: 'USDC', status: 'pending', due: '2024-04-30', issued: '2024-04-01', description: 'Smart Contract Audit & Integration' },
  { id: 'INV-004', client: 'DeFi Capital', amount: 5000, currency: 'USDC', status: 'overdue', due: '2024-03-01', issued: '2024-02-15', description: 'Advisory Services - Feb 2024' },
]

export const CHART_PAYROLL_DATA = [
  { month: 'Oct', amount: 42000 },
  { month: 'Nov', amount: 44500 },
  { month: 'Dec', amount: 48200 },
  { month: 'Jan', amount: 48200 },
  { month: 'Feb', amount: 55200 },
  { month: 'Mar', amount: 55200 },
  { month: 'Apr', amount: 62700 },
]

export const CHART_TREASURY_DATA = [
  { month: 'Oct', balance: 620000 },
  { month: 'Nov', balance: 575000 },
  { month: 'Dec', balance: 530000 },
  { month: 'Jan', balance: 565000 },
  { month: 'Feb', balance: 510000 },
  { month: 'Mar', balance: 485000 },
]
