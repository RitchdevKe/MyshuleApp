import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  FileText, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Calendar, 
  Users, 
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Briefcase,
  ShieldAlert,
  Send,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  Bookmark,
  Bell,
  Printer,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { toast } from 'react-hot-toast';
import { Student, FeeTransaction } from '../types.ts';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

// Core Account Heads definitions for General Ledger
export interface AccountHead {
  code: string;
  name: string;
  category: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  department: string;
  status: 'Draft' | 'Posted' | 'Audited';
  lines: {
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  approver: string;
}

export interface PayableInvoice {
  id: string;
  vendor: string;
  item: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'Under Review' | 'Pending Approval' | 'Scheduled' | 'Paid';
  paymentDate?: string;
  referenceNo?: string;
}

export interface BankFeedTransaction {
  id: string;
  gateway: 'M-Pesa Paybill' | 'KCB Bank Direct' | 'Equity Bank API';
  reference: string;
  amount: number;
  senderName: string;
  senderPhone?: string;
  timestamp: string;
  reconciled: boolean;
  reconciledStudentId?: string;
}

interface AccountingSubsystemProps {
  tab: 'accounting_dash' | 'general_ledger' | 'accounts_payable' | 'accounts_receivable';
  students: Student[];
  transactions: FeeTransaction[];
  onTabChange?: (tab: any) => void;
}

export function AccountingSubsystem({ tab, students, transactions, onTabChange }: AccountingSubsystemProps) {
  const { currency } = useCurrency();

  // ----------------- STATE STORES & SIMULATIONS -----------------

  // --- Upgraded School Accounting states ---
  // A. Accounts Printing Portal state
  const [activePipelineId, setActivePipelineId] = useState<'billing' | 'dep_recon' | 'general_ledger' | 'disbursement'>('billing');
  const [activeReportId, setActiveReportId] = useState<'trial_balance' | 'cash_book' | 'ledger_summary' | 'income_expenditure'>('trial_balance');
  const [reportYearFilter, setReportYearFilter] = useState('2025/2026');
  const [reportMonthFilter, setReportMonthFilter] = useState('All');
  const [selectedReportAccount, setSelectedReportAccount] = useState('SCHOOL FUND');
  const [activeApSubView, setActiveApSubView] = useState<'analytics' | 'operations'>('analytics');




  // B. Payment Voucher (PV) for Other Expenses lists
  interface PaymentVoucher {
    pvNo: string;
    date: string;
    description: string;
    supplier: string;
    invoiceNo: string;
    deliveryNo: string;
    amount: number;
    cashAmount: number;
    chequeAmount: number;
    chequeNo: string;
    voteHead: string;
    account: string;
    petty: boolean;
  }

  const [paymentVouchers, setPaymentVouchers] = useState<PaymentVoucher[]>([
    {
      pvNo: "PV-2026-0801",
      date: "2026-06-03",
      description: "Emergency bus radiator replacement and engine overhaul",
      supplier: "Securex Patrols East Africa",
      invoiceNo: "INV-SIG-8490",
      deliveryNo: "DN-4921",
      amount: 45000,
      cashAmount: 0,
      chequeAmount: 45000,
      chequeNo: "CHQ-001923",
      voteHead: "BUS",
      account: "SCHOOL FUND",
      petty: false
    },
    {
      pvNo: "PV-2026-0802",
      date: "2026-06-02",
      description: "Science department midterm exam booklet paper stock and ink",
      supplier: "Apex Stationers Kenya",
      invoiceNo: "INV-APEX-1982",
      deliveryNo: "DN-1092",
      amount: 18500,
      cashAmount: 18500,
      chequeAmount: 0,
      chequeNo: "",
      voteHead: "ACADEMIC",
      account: "SCHOOL FUND",
      petty: true
    },
    {
      pvNo: "PV-2026-0803",
      date: "2026-06-01",
      description: "Hostel kitchen fuel provisions refilling",
      supplier: "Brookside Dairies",
      invoiceNo: "INV-BRK-9902",
      deliveryNo: "DN-8812",
      amount: 64000,
      cashAmount: 0,
      chequeAmount: 64000,
      chequeNo: "CHQ-99082",
      voteHead: "FOOD",
      account: "SCHOOL FUND",
      petty: false
    }
  ]);

  // Form states for creating a new PV
  const [pvSupplier, setPvSupplier] = useState('Brookside Dairies');
  const [pvDate, setPvDate] = useState('2026-06-04');
  const [pvType, setPvType] = useState('General');
  const [pvInvNo, setPvInvNo] = useState('');
  const [pvDelNo, setPvDelNo] = useState('');
  const [pvDescription, setPvDescription] = useState('');
  const [pvVoteHead, setPvVoteHead] = useState('BUS');
  const [pvAccount, setPvAccount] = useState('SCHOOL FUND');
  const [pvCashPayment, setPvCashPayment] = useState<number>(0);
  const [pvChequePayment, setPvChequePayment] = useState<number>(0);
  const [pvChequeNo, setPvChequeNo] = useState('');
  const [pvAutoNoCheck, setPvAutoNoCheck] = useState(true);

  // Active print visual states
  const [activePrintPv, setActivePrintPv] = useState<PaymentVoucher | null>(null);

  // C. Interactive Student Fee Payment Records State
  const [selectedFeeStudentId, setSelectedFeeStudentId] = useState('3021');
  const [feeFormAccount, setFeeFormAccount] = useState('SCHOOL FUND');
  const [feeFormTerm, setFeeFormTerm] = useState('II');
  const [feeFormAmountPaid, setFeeFormAmountPaid] = useState<number>(0);
  const [feeFormPaymentMode, setFeeFormPaymentMode] = useState<'Cash' | 'M-Pesa' | 'Bank Slip' | 'Cheque' | 'Fee in Kind' | 'Bursary' | 'Payroll'>('M-Pesa');
  const [feeFormChequeOrSlipNo, setFeeFormChequeOrSlipNo] = useState('');
  const [feeFormSpecialPayment, setFeeFormSpecialPayment] = useState(false);
  const [feeFormAutoSms, setFeeFormAutoSms] = useState(true);
  const [feeFormBankDeposit, setFeeFormBankDeposit] = useState('KCB Bank');

  // Interactive printable Receipt popup state after success pay
  const [activeReceiptPrint, setActiveReceiptPrint] = useState<{
    receiptNo: string;
    studentName: string;
    admNo: string;
    date: string;
    term: string;
    account: string;
    amountPaid: number;
    paymentMode: string;
    balanceBefore: number;
    balanceAfter: number;
    special: boolean;
  } | null>(null);

  // Active AR Sub-tab toggle
  const [activeArSubTab, setActiveArSubTab] = useState<'dashboard' | 'fee_payment'>('fee_payment'); // Default to beautiful fee payment console!
  // Active AP Sub-tab toggle
  const [activeApSubTab, setActiveApSubTab] = useState<'invoices' | 'expenses_pv'>('expenses_pv'); // Default to stunning PV expenses wizard!
  // Active GL Sub-tab toggle
  const [activeGlSubTab, setActiveGlSubTab] = useState<'ledgers' | 'printing_portal'>('printing_portal'); // Default to amazing reports portal!


  // 1. General Ledger State
  // Real Accounts Receivable = sum of every active student's outstanding fee balance.
  // Real Tuition Revenue (collected) = sum of all recorded fee transactions.
  // These two numbers anchor the rest of the chart of accounts to the school's actual fee book,
  // rather than floating disconnected from the data the rest of the app already tracks.
  const realOutstandingReceivables = useMemo(() => {
    return students.reduce((sum, s) => sum + (s.feeBalance || 0), 0);
  }, [students]);

  const realTuitionCollected = useMemo(() => {
    return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const [accountHeads, setAccountHeads] = useState<AccountHead[]>([
    // Assets
    { code: '1010', name: 'Cash & Main Bank Account', category: 'Assets', balance: 3450000 },
    { code: '1020', name: 'Student Accounts Receivable', category: 'Assets', balance: realOutstandingReceivables },
    { code: '1035', name: 'Global Asset Inventory', category: 'Assets', balance: 1450000 },
    // Liabilities
    { code: '2010', name: 'Vendor Accounts Payable', category: 'Liabilities', balance: 540000 },
    { code: '2030', name: 'Accrued Staff Wages/Payroll', category: 'Liabilities', balance: 410000 },
    // Equity
    { code: '3010', name: 'SaaS Board Retained Earnings', category: 'Equity', balance: 3500000 },
    // Revenue
    { code: '4010', name: 'Tuition Fee Registry Revenue', category: 'Revenue', balance: realTuitionCollected },
    { code: '4030', name: 'Canteen Cash POS Revenue', category: 'Revenue', balance: 280000 },
    { code: '4050', name: 'Transport System Subscriptions', category: 'Revenue', balance: 450000 },
    // Expenses
    { code: '5010', name: 'Academic Faculty Salaries', category: 'Expenses', balance: 2100000 },
    { code: '5020', name: 'Facility Maintenance & Utilities', category: 'Expenses', balance: 830000 },
    { code: '5040', name: 'Boarding Food & Provisions Procurements', category: 'Expenses', balance: 640000 },
    { code: '5060', name: 'General Administrative Supplies', category: 'Expenses', balance: 310000 },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'JV-2026-084',
      date: '2026-06-01',
      reference: 'REF-PAY-09',
      description: 'Monthly teaching faculty salary disbursement',
      department: 'HR & Administration',
      status: 'Audited',
      lines: [
        { accountCode: '5010', accountName: 'Academic Faculty Salaries', debit: 2100000, credit: 0 },
        { accountCode: '1010', accountName: 'Cash & Main Bank Account', debit: 0, credit: 2100000 },
      ],
      approver: 'Mr. Daniel Gitumu (Principal)'
    },
    {
      id: 'JV-2026-085',
      date: '2026-06-02',
      reference: 'REF-CAN-122',
      description: 'Weekly cash collections consolidation from Smart Canteen POS',
      department: 'Canteen Operations',
      status: 'Posted',
      lines: [
        { accountCode: '1010', accountName: 'Cash & Main Bank Account', debit: 45000, credit: 0 },
        { accountCode: '4030', accountName: 'Canteen Cash POS Revenue', debit: 0, credit: 45000 },
      ],
      approver: 'Mrs. Winnie Tabitha'
    },
    {
      id: 'JV-2026-086',
      date: '2026-06-03',
      reference: 'REF-MNT-501',
      description: 'Emergency generator diesel refuelling invoice posting',
      department: 'Estate Maintenance',
      status: 'Draft',
      lines: [
        { accountCode: '5020', accountName: 'Facility Maintenance & Utilities', debit: 18500, credit: 0 },
        { accountCode: '2010', accountName: 'Vendor Accounts Payable', debit: 0, credit: 18500 },
      ],
      approver: 'Mrs. Mercy Chepkoech'
    }
  ]);

  // Create Journal Entry variables
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);
  const [newJwRef, setNewJwRef] = useState('');
  const [newJwDesc, setNewJwDesc] = useState('');
  const [newJwDept, setNewJwDept] = useState('Academic Head');
  
  // Ledger row inputs (supports up to 4 lines for complex splits)
  const [jwLines, setJwLines] = useState([
    { accountCode: '', debit: 0, credit: 0 },
    { accountCode: '', debit: 0, credit: 0 }
  ]);

  // 2. Accounts Payable State
  const [payableInvoices, setPayableInvoices] = useState<PayableInvoice[]>([
    { id: 'PINV-2026-041', vendor: 'Brookside Dairies', item: 'White Milk Sacks - Term 2 Boarding Ration', amount: 85000, dueDate: '2026-06-15', category: 'Boarding Food & provisions', status: 'Pending Approval' },
    { id: 'PINV-2026-042', vendor: 'Securex Patrols East Africa', item: 'Perimeter fencing armed guards & surveillance deployment', amount: 120000, dueDate: '2026-06-12', category: 'Facility Maintenance', status: 'Scheduled' },
    { id: 'PINV-2026-043', vendor: 'Mawingu Fiber Telecoms', item: 'Central Administration gigabit campus internet broadband lease', amount: 45000, dueDate: '2026-06-08', category: 'General Admin Utilities', status: 'Paid', paymentDate: '2026-06-02', referenceNo: 'TX-MAW-90218' },
    { id: 'PINV-2026-044', vendor: 'Sigma Chemicals Ltd', item: 'Practical reagents supply bundle for physics & chemistry midterm lab', amount: 18500, dueDate: '2026-06-25', category: 'Academic Supplies', status: 'Under Review' },
    { id: 'PINV-2026-045', vendor: 'Apex Stationers Kenya', item: 'Full bundle premium exam booklet publishing papers', amount: 34000, dueDate: '2026-06-10', category: 'General Admin Utilities', status: 'Pending Approval' }
  ]);

  const [vendorList, setVendorList] = useState([
    'Brookside Dairies',
    'Securex Patrols East Africa',
    'Mawingu Fiber Telecoms',
    'Sigma Chemicals Ltd',
    'Apex Stationers Kenya'
  ]);

  // Create Supplier Invoice variables
  const [showAddPayableModal, setShowAddPayableModal] = useState(false);
  const [newPayVendor, setNewPayVendor] = useState('Brookside Dairies');
  const [newPayItem, setNewPayItem] = useState('');
  const [newPayAmount, setNewPayAmount] = useState<number>(0);
  const [newPayDue, setNewPayDue] = useState('');
  const [newPayCat, setNewPayCat] = useState('General Admin Utilities');

  // Scheduler payment states
  const [showScheduleModal, setShowScheduleModal] = useState<string | null>(null);
  const [scheduleBankSource, setScheduleBankSource] = useState('Cash & Main Bank Account');
  const [scheduleDate, setScheduleDate] = useState('');

  // 3. Accounts Receivable State (Smart Collection, Batch Billing, Bank Reconciliation)
  const [activeStudents, setActiveStudents] = useState<Student[]>(students);

  // Keep the local AR working-copy in sync with the real students prop.
  // Without this, a fee payment recorded elsewhere in the app (e.g. the Payments
  // module) would never be reflected here, since useState only seeds its initial
  // value once and ignores later prop changes.
  useEffect(() => {
    setActiveStudents(students);
  }, [students]);
  const [billingClass, setBillingClass] = useState('All');
  const [billingItem, setBillingItem] = useState('Term 2 Project Developmental Fund');
  const [billingAmount, setBillingAmount] = useState<number>(8500);

  // Bank Feed Registry simulation
  const [bankFeeds, setBankFeeds] = useState<BankFeedTransaction[]>([
    { id: 'BF-302', gateway: 'M-Pesa Paybill', reference: 'MP-KCB-9240', amount: 25000, senderName: 'Janet Omari (Parent of Douglas Omari)', senderPhone: '+254 712 345678', timestamp: '2026-06-04 10:22', reconciled: false },
    { id: 'BF-303', gateway: 'KCB Bank Direct', reference: 'KCB-DEP-7201', amount: 12500, senderName: 'John Wanjala (Parent of Emily Wanjala)', timestamp: '2026-06-04 11:30', reconciled: false },
    { id: 'BF-304', gateway: 'Equity Bank API', reference: 'EQB-X-89410', amount: 15000, senderName: 'Pius Mwambia Snr', timestamp: '2026-06-03 16:45', reconciled: false },
    { id: 'BF-305', gateway: 'M-Pesa Paybill', reference: 'MP-NIP-1294', amount: 5000, senderName: 'Adrian Kipirono Guardian', senderPhone: '+254 722 987654', timestamp: '2026-06-03 09:12', reconciled: false }
  ]);

  // Send Fee Warning SMS state selection
  const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
  const [showSmsPreviewModal, setShowSmsPreviewModal] = useState(false);

  // Forecast AI Variable State
  
  // Real cash position snapshot. We only have one consolidated cash balance from the
  // chart of accounts (no per-bank-account ledger granularity yet), so rather than
  // fabricate three separate fake account splits, this presents the same real total
  // under three views the registrar actually cares about: the bank-recorded balance,
  // recent outflows, and where the money is actually going by category.
  const realRecentOutflows = useMemo(() => {
    return [...paymentVouchers]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4)
      .map(pv => ({
        title: pv.description,
        item: pv.date,
        amount: `- ${currency} ${pv.amount.toLocaleString()}`,
        supplier: pv.supplier,
      }));
  }, [paymentVouchers, currency]);

  const realExpenseCategories = useMemo(() => {
    const byCategory: Record<string, number> = {};
    payableInvoices.forEach(inv => {
      byCategory[inv.category] = (byCategory[inv.category] || 0) + inv.amount;
    });
    const total = Object.values(byCategory).reduce((a, b) => a + b, 0) || 1;
    const icons: Record<string, string> = {
      'Boarding Food & provisions': '🍽️',
      'Facility Maintenance': '🔧',
      'General Admin Utilities': '💡',
      'Academic Supplies': '📚',
    };
    return Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount: `${currency} ${amount.toLocaleString()}`,
        pct: Math.round((amount / total) * 100),
        icon: icons[name] || '📦',
      }));
  }, [payableInvoices, currency]);

  const realMonthlyOutflows = useMemo(() => {
    const byMonth: Record<string, number> = {};
    paymentVouchers.forEach(pv => {
      const m = new Date(pv.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      byMonth[m] = (byMonth[m] || 0) + pv.amount;
    });
    return Object.entries(byMonth).map(([month, val]) => ({ month, val: Math.round(val / 1000) }));
  }, [paymentVouchers]);
  const [forecastMonths, setForecastMonths] = useState(3);
  const [anticipatedCollection_pct, setAnticipatedCollection_pct] = useState(85);
  const [termRetentionRate_pct, setTermRetentionRate_pct] = useState(98);

  // ----------------- CALCULATIONS -----------------

  // 4. Accounts Aging Calculation for AP
  const apAging = useMemo(() => {
    let current = 0;
    let d1_30 = 0;
    let d31_60 = 0;
    let d61_plus = 0;

    // Use the real current date rather than a frozen snapshot, so aging buckets
    // stay accurate as time passes instead of silently drifting stale.
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const parseDate = (dStr: string) => new Date(dStr).getTime();

    payableInvoices.forEach(inv => {
      if (inv.status === 'Paid') return;
      const dueMs = parseDate(inv.dueDate);
      const diffDays = Math.ceil((dueMs - todayMs) / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        current += inv.amount;
      } else {
        const absDiff = Math.abs(diffDays);
        if (absDiff <= 30) d1_30 += inv.amount;
        else if (absDiff <= 60) d31_60 += inv.amount;
        else d61_plus += inv.amount;
      }
    });

    return { current, d1_30, d31_60, d61_plus };
  }, [payableInvoices]);

  // Overall calculations for Cash stats
  const revenueTotal = useMemo(() => {
    return accountHeads.filter(a => a.category === 'Revenue').reduce((acc, h) => acc + h.balance, 0);
  }, [accountHeads]);

  const expenseTotal = useMemo(() => {
    return accountHeads.filter(a => a.category === 'Expenses').reduce((acc, h) => acc + h.balance, 0);
  }, [accountHeads]);

  const cashPositions = useMemo(() => {
    return accountHeads.find(a => a.code === '1010')?.balance || 0;
  }, [accountHeads]);

  // Real recent fee collections, newest first — replaces the fictional company-name activity feed.
  const recentFeeCollections = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [transactions]);

  // Real revenue collected per day, derived from actual transaction dates — replaces the hardcoded wave chart.
  const realDailyRevenueData = useMemo(() => {
    const byDate: Record<string, number> = {};
    transactions.forEach(t => {
      const d = new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      byDate[d] = (byDate[d] || 0) + t.amount;
    });
    const entries = Object.entries(byDate)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-14);
    return entries.map(([name, val]) => ({ name, val }));
  }, [transactions]);

  // Fee collection status breakdown — replaces the fictional "Invoice Paid/Unpaid/Overdue" doughnut.
  const feeStatusBreakdown = useMemo(() => {
    const cleared = students.filter(s => s.feeBalance <= 0).length;
    const partial = students.filter(s => s.feeBalance > 0 && s.feeBalance < (s.totalFees || 0)).length;
    const unpaid = students.filter(s => s.totalFees > 0 && s.feeBalance >= s.totalFees).length;
    return { cleared, partial, unpaid, total: students.length };
  }, [students]);

  // Financial Forecast Multiplier Area Chart Data
  const forecastChartData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let rollingBalance = cashPositions;
    const baseRevenueInput = 1450000; // Monthly potential fees
    const baseExpenseCosts = 910000; // Salaries + utility operations
    
    return months.slice(0, forecastMonths).map((mo, idx) => {
      // Simulate factoring in retention and collection rates
      const monthlyFeesCollected = baseRevenueInput * (anticipatedCollection_pct / 100) * (termRetentionRate_pct / 100);
      const monthlyNet = monthlyFeesCollected - baseExpenseCosts;
      rollingBalance += monthlyNet;

      return {
        name: mo,
        Revenue: Math.round(monthlyFeesCollected),
        Expenses: baseExpenseCosts,
        ForecastCash: Math.round(rollingBalance)
      };
    });
  }, [cashPositions, forecastMonths, anticipatedCollection_pct, termRetentionRate_pct]);

  // High fidelity daily April mock dataset matching the Accentra chart points
  const revenueDailyData = useMemo(() => [
    { name: '14 Apr', Revenue: 45000 },
    { name: '15 Apr', Revenue: 52000 },
    { name: '16 Apr', Revenue: 42000 },
    { name: '17 Apr', Revenue: 78000 },
    { name: '18 Apr', Revenue: 35000 },
    { name: '19 Apr', Revenue: 58000 },
    { name: '20 Apr', Revenue: 41000 },
    { name: '21 Apr', Revenue: 61000 },
    { name: '22 Apr', Revenue: 44000 },
    { name: '23 Apr', Revenue: 48000 },
    { name: '24 Apr', Revenue: 45000 },
  ], []);

  // Pie Chart Expenditure Data from accounts
  const expensePieData = useMemo(() => {
    return accountHeads
      .filter(a => a.category === 'Expenses')
      .map(exp => ({
        name: exp.name.replace('Disbursements', '').replace('Expenses', '').replace('Procurements', ''),
        value: exp.balance
      }));
  }, [accountHeads]);

  const COLORS = ['#3D1D3F', '#C20F47', '#D15C22', '#7C2D12', '#0F172A'];

  // Balance Check for Trial Balance
  const trialBalanceSums = useMemo(() => {
    let debits = 0;
    let credits = 0;
    accountHeads.forEach(acc => {
      // Normal balance: Asset & Expense = Debit. Liabilities, Equity, Revenue = Credit.
      if (acc.category === 'Assets' || acc.category === 'Expenses') {
        debits += acc.balance;
      } else {
        credits += acc.balance;
      }
    });
    return { debits, credits, balances: debits === credits };
  }, [accountHeads]);

  // Real consolidated cash book: merges actual fee receipts (money in) and actual payment
  // vouchers (money out) into one chronological ledger with a genuine running balance,
  // rather than two hand-typed example rows and a fabricated balance formula.
  const cashBookEntries = useMemo(() => {
    const openingBalance = 3450000; // carried opening balance for the term, set at term start
    type CashRow = { date: string; ref: string; description: string; debit: number; credit: number };

    const receiptRows: CashRow[] = transactions.map(t => ({
      date: t.date,
      ref: t.reference,
      description: `${t.studentName} — fee payment (${t.type})`,
      debit: t.amount,
      credit: 0,
    }));

    const voucherRows: CashRow[] = paymentVouchers.map(pv => ({
      date: pv.date,
      ref: pv.pvNo,
      description: `${pv.description} — ${pv.supplier}`,
      debit: 0,
      credit: pv.amount,
    }));

    const sorted = [...receiptRows, ...voucherRows].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let running = openingBalance;
    const rows = sorted.map(row => {
      running = running + row.debit - row.credit;
      return { ...row, runningBalance: running };
    });

    return { openingBalance, rows, closingBalance: running };
  }, [transactions, paymentVouchers]);


  // ----------------- EVENT HANDLERS -----------------

  // Posting custom double-entry journal voucher
  const handlePostJournal = () => {
    if (!newJwRef || !newJwDesc) {
      toast.error('Voucher reference number and narrative description required.');
      return;
    }

    // Check account selection inside grids
    let creditSum = 0;
    let debitSum = 0;
    const linesToInsert: any[] = [];

    for (let line of jwLines) {
      if (!line.accountCode) {
        toast.error('Every transaction row must carry a valid account allocation.');
        return;
      }
      const acc = accountHeads.find(a => a.code === line.accountCode);
      if (!acc) return;

      debitSum += Number(line.debit);
      creditSum += Number(line.credit);
      linesToInsert.push({
        accountCode: line.accountCode,
        accountName: acc.name,
        debit: Number(line.debit),
        credit: Number(line.credit)
      });
    }

    if (debitSum !== creditSum) {
      toast.error(`Book ledger error: Debit (${currency} ${debitSum.toLocaleString()}) must exactly balance Credit (${currency} ${creditSum.toLocaleString()}).`);
      return;
    }

    if (debitSum === 0) {
      toast.error('The transaction cannot carry neutral zero value.');
      return;
    }

    // Insert new item
    const newEntry: JournalEntry = {
      id: `JV-2026-0${journalEntries.length + 87}`,
      date: new Date().toISOString().split('T')[0],
      reference: newJwRef,
      description: newJwDesc,
      department: newJwDept,
      status: 'Posted',
      lines: linesToInsert,
      approver: 'Mr. Daniel Gitumu (Principal)'
    };

    // Update account balances
    const updatedHeads = accountHeads.map(head => {
      let delta = 0;
      linesToInsert.forEach(line => {
        if (line.accountCode === head.code) {
          // Debit increases Assets & Expenses, decreases Capital, Liabilities & Revenue. Credit does inverse.
          if (head.category === 'Assets' || head.category === 'Expenses') {
            delta += line.debit - line.credit;
          } else {
            delta += line.credit - line.debit;
          }
        }
      });
      return { ...head, balance: head.balance + delta };
    });

    setAccountHeads(updatedHeads);
    setJournalEntries([newEntry, ...journalEntries]);
    setShowAddJournalModal(false);
    setNewJwRef('');
    setNewJwDesc('');
    setJwLines([{ accountCode: '', debit: 0, credit: 0 }, { accountCode: '', debit: 0, credit: 0 }]);
    toast.success(`Journal voucher ${newEntry.id} logged and books updated.`);
  };

  // Log new payable supplier invoice
  const handleCreatePayable = () => {
    if (!newPayItem || newPayAmount <= 0 || !newPayDue) {
      toast.error('Please fill in complete invoice descriptor, positive amount, and deadline calendar limit.');
      return;
    }

    const newInvoice: PayableInvoice = {
      id: `PINV-2026-0${payableInvoices.length + 46}`,
      vendor: newPayVendor,
      item: newPayItem,
      amount: Number(newPayAmount),
      dueDate: newPayDue,
      category: newPayCat,
      status: 'Pending Approval'
    };

    setPayableInvoices([newInvoice, ...payableInvoices]);
    setShowAddPayableModal(false);
    setNewPayItem('');
    setNewPayAmount(0);
    setNewPayDue('');
    toast.success(`Registered supplier bill ${newInvoice.id} under liability listings.`);
  };

  // Schedule and process payout run
  const handleExecuteScheduledPayment = (invoiceId: string) => {
    const inv = payableInvoices.find(p => p.id === invoiceId);
    if (!inv) return;

    // Change status
    const updatedPayables = payableInvoices.map(p => {
      if (p.id === invoiceId) {
        return {
          ...p,
          status: 'Paid' as const,
          paymentDate: scheduleDate || new Date().toISOString().split('T')[0],
          referenceNo: `TX-BANK-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return p;
    });

    // Post to General Ledger ledger instantly
    const updatedHeads = accountHeads.map(head => {
      if (head.code === '1010') {
        return { ...head, balance: head.balance - inv.amount }; // Cash decreases
      }
      if (head.code === '2010') {
        return { ...head, balance: Math.max(0, head.balance - inv.amount) }; // Payable liability decreases
      }
      return head;
    });

    setAccountHeads(updatedHeads);
    setPayableInvoices(updatedPayables);
    setShowScheduleModal(null);
    toast.success(`Wire transfer cleared ${currency} ${inv.amount.toLocaleString()} for ${inv.vendor}. Ledger balances linked.`);
  };

  // Upgraded School Fee Payment Submission handler
  const handlePostFeePayment = () => {
    if (feeFormAmountPaid <= 0) {
      toast.error("Please enter a valid positive payment amount.");
      return;
    }

    const student = activeStudents.find(s => s.id === selectedFeeStudentId);
    if (!student) {
      toast.error("Student profile not found inside the active registry.");
      return;
    }

    const previousBalance = student.feeBalance;
    const finalBalance = Math.max(0, previousBalance - feeFormAmountPaid);

    // Update active student files in local state
    const updatedStudents = activeStudents.map(s => {
      if (s.id === selectedFeeStudentId) {
        return {
          ...s,
          feeBalance: finalBalance
        };
      }
      return s;
    });
    setActiveStudents(updatedStudents);

    // Double-Entry Adjustment: Cash & Bank (Code 1010) increases, Accounts Receivable (Code 1020) decreases.
    const updatedHeads = accountHeads.map(head => {
      if (head.code === '1010') {
        return { ...head, balance: head.balance + feeFormAmountPaid };
      }
      if (head.code === '1020') {
        return { ...head, balance: Math.max(0, head.balance - feeFormAmountPaid) };
      }
      return head;
    });
    setAccountHeads(updatedHeads);

    // Generate transaction receipt
    const genReceiptNo = `REC-2026-F${Math.floor(100800 + Math.random() * 899000)}`;
    const receiptData = {
      receiptNo: genReceiptNo,
      studentName: student.name,
      admNo: student.id,
      date: new Date().toISOString().split('T')[0],
      term: feeFormTerm,
      account: feeFormAccount,
      amountPaid: feeFormAmountPaid,
      paymentMode: feeFormPaymentMode,
      balanceBefore: previousBalance,
      balanceAfter: finalBalance,
      special: feeFormSpecialPayment
    };

    setActiveReceiptPrint(receiptData);
    setFeeFormAmountPaid(0);
    setFeeFormChequeOrSlipNo('');

    if (feeFormAutoSms) {
      toast.success(`Broadcasting instant auto-sms payment confirmation alert to ${student.name}'s parents!`);
    }
    toast.success(`Fees of ${currency} ${feeFormAmountPaid.toLocaleString()} credited successfully. Receipt ${genReceiptNo} initialized!`);
  };

  // Upgraded School Expenditure / Payment Voucher (PV) Creation handler
  const handleCreatePaymentVoucher = () => {
    const totalAmount = Number(pvCashPayment) + Number(pvChequePayment);
    if (!pvDescription.trim()) {
      toast.error("Please insert a clear narrative descriptor explaining payment purpose.");
      return;
    }
    if (totalAmount <= 0) {
      toast.error("Voucher must carry a non-zero payout. Please set Cash or Cheque payouts.");
      return;
    }

    const systemPvNo = pvAutoNoCheck 
      ? `PV-2026-0${paymentVouchers.length + 804}` 
      : `PV-${Math.floor(10000 + Math.random() * 89999)}`;

    const newPv: PaymentVoucher = {
      pvNo: systemPvNo,
      date: pvDate,
      description: pvDescription,
      supplier: pvSupplier,
      invoiceNo: pvInvNo || "N/A",
      deliveryNo: pvDelNo || "N/A",
      amount: totalAmount,
      cashAmount: Number(pvCashPayment),
      chequeAmount: Number(pvChequePayment),
      chequeNo: pvChequeNo,
      voteHead: pvVoteHead,
      account: pvAccount,
      petty: Number(pvCashPayment) > 0 && Number(pvChequePayment) === 0
    };

    // Update state lists
    setPaymentVouchers([newPv, ...paymentVouchers]);

    // Double-Entry Adjustment: Subtract from Cash & Main Bank (Code 1010) and increase Expenditure
    const updatedHeads = accountHeads.map(head => {
      if (head.code === '1010') {
        return { ...head, balance: Math.max(0, head.balance - totalAmount) };
      }
      // If code matches expenditures
      if (head.code === '5010') { // Administrative Expense standard code
        return { ...head, balance: head.balance + totalAmount };
      }
      return head;
    });
    setAccountHeads(updatedHeads);

    // Reset Form
    setPvDescription('');
    setPvInvNo('');
    setPvDelNo('');
    setPvCashPayment(0);
    setPvChequePayment(0);
    setPvChequeNo('');

    toast.success(`Expenditure voucher ${systemPvNo} successfully committed to ledger! School Fund liquidity adjusted.`);
  };

  // Trigger Class-Wide billing charges
  const handleTriggerBatchBilling = () => {
    if (billingAmount <= 0 || !billingItem) {
      toast.error('Configure valid debit item and amount parameter.');
      return;
    }

    // Filter students
    let count = 0;
    const updatedStudents = activeStudents.map(stud => {
      const matchForm = billingClass === 'All' || String(stud.form) === billingClass;
      if (matchForm) {
        count++;
        return {
          ...stud,
          feeBalance: stud.feeBalance + billingAmount,
          totalFees: stud.totalFees + billingAmount
        };
      }
      return stud;
    });

    // Update Accounts Receivable in General Ledger Setup
    const updatedHeads = accountHeads.map(head => {
      if (head.code === '1020') {
        return { ...head, balance: head.balance + (billingAmount * count) }; // Accounts Receivable increases
      }
      if (head.code === '4010') {
        return { ...head, balance: head.balance + (billingAmount * count) }; // Tuition Revenue increases
      }
      return head;
    });

    setAccountHeads(updatedHeads);
    setActiveStudents(updatedStudents);
    toast.success(`Batch Invoiced completed: Debited ${currency} ${billingAmount.toLocaleString()} to ${count} students. General Ledger updated.`);
  };

  // 1-Click Bank Feed Match Reconciliation
  const handleReconcileBankFeed = (feedId: string, studentId: string) => {
    const feed = bankFeeds.find(f => f.id === feedId);
    const stud = activeStudents.find(s => s.id === studentId);
    if (!feed || !stud) return;

    // Reduce fee outstanding inside student data
    const updatedStudents = activeStudents.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          feeBalance: Math.max(0, s.feeBalance - feed.amount)
        };
      }
      return s;
    });

    // Reconcile Feed
    const updatedFeeds = bankFeeds.map(f => {
      if (f.id === feedId) {
        return { ...f, reconciled: true, reconciledStudentId: studentId };
      }
      return f;
    });

    // Adjust Cash Ledger up and Accounts Receivable down
    const updatedHeads = accountHeads.map(head => {
      if (head.code === '1010') {
        return { ...head, balance: head.balance + feed.amount }; // Cash grows
      }
      if (head.code === '1020') {
        return { ...head, balance: Math.max(0, head.balance - feed.amount) }; // Receivable decreases
      }
      return head;
    });

    setAccountHeads(updatedHeads);
    setActiveStudents(updatedStudents);
    setBankFeeds(updatedFeeds);
    toast.success(`Auto-matched Paybill ref ${feed.reference} directly to registry matching ${stud.name}. Ledger synchronized!`);
  };

  // Broadcast reminder outbound warnings
  const handleSendDebtorAlerts = () => {
    if (selectedDebtors.length === 0) {
      toast.error('Assign selection coordinates on fee-overdue catalog listings first.');
      return;
    }
    toast.success(`Outstanding Fee SMS broadcasts triggered to ${selectedDebtors.length} parental accounts.`);
    setShowSmsPreviewModal(false);
    setSelectedDebtors([]);
  };

  // Toggle selection on direct debtors check lists
  const toggleSelectDebtor = (id: string) => {
    setSelectedDebtors(prev => 
      prev.includes(id) ? prev.filter(itemNo => itemNo !== id) : [...prev, id]
    );
  };


  return (
    <div className="space-y-4">
      
      {/* 🔮 Independent Executive Treasury HUD Cards - Three Standardized Freestanding Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: GAAP Compliance Core */}
        <div className="bg-gradient-to-br from-[#1F1022] via-[#1A0C22] to-[#110515] rounded-[1.5rem] p-4 text-white border border-[#4D2752]/50 shadow-xl flex flex-col justify-between h-[120px] relative overflow-hidden group select-none transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF5D8F]/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div>
            <span className="text-[11px] text-pink-300 font-medium uppercase tracking-wide block">GAAP Compliance</span>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5D8F] animate-pulse shrink-0" />
              <span className="text-2xl font-bold tabular-nums text-white tracking-tight">ACTIVE</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF5D8F] to-pink-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Card 2: Liquid Cash Reserves */}
        <div className="bg-gradient-to-br from-[#0B2216] via-[#06190F] to-[#010B07] rounded-[1.5rem] p-4 text-white border border-emerald-950/75 shadow-xl flex flex-col justify-between h-[120px] relative overflow-hidden group select-none transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div>
            <span className="text-[11px] text-emerald-300 font-medium uppercase tracking-wide block">Liquid Cash Reserves</span>
            <div className="flex items-baseline gap-1 mt-2.5">
              <span className="text-sm text-emerald-400 font-bold tabular-nums mr-1">{currency}</span>
              <span className="text-2xl font-bold tabular-nums text-white tracking-tight">{cashPositions.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        {/* Card 3: Outstanding Receivables */}
        <div className="bg-gradient-to-br from-[#25180E] via-[#1A1009] to-[#0F0803] rounded-[1.5rem] p-4 text-white border border-amber-950/75 shadow-xl flex flex-col justify-between h-[120px] relative overflow-hidden group select-none transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div>
            <span className="text-[11px] text-amber-300 font-medium uppercase tracking-wide block">Outstanding Receivables</span>
            <div className="flex items-baseline gap-1 mt-2.5">
              <span className="text-sm text-amber-400 font-bold tabular-nums mr-1">{currency}</span>
              <span className="text-2xl font-bold tabular-nums text-white tracking-tight">{realOutstandingReceivables.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" style={{ width: '42%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* RENDER ACCORDING TO SELECTED TAB MODULE */}

      {/* TAB 1: ACCOUNTING DASHBOARD */}
      {tab === 'accounting_dash' && (() => {
        return (
          <div className="space-y-4">
            {/* Header Card */}
            <div className="bg-[#3D1D3F] rounded-[1.5rem] p-4 text-white relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-3">
                 <div className="space-y-3 flex-1 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                       <h2 className="text-sm font-semibold text-white">Welcome, Anne</h2>
                       <div className="flex p-1 bg-white/10 rounded-lg text-xs font-medium gap-0.5 flex-wrap">
                          {[
                            { id: 'accounting_dash', label: 'Dashboard' },
                            { id: 'accounts_receivable', label: 'Transactions' },
                            { id: 'general_ledger', label: 'Report' },
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => onTabChange?.(item.id as any)}
                              className={`px-2.5 py-1.5 rounded-md transition cursor-pointer border-none whitespace-nowrap ${
                                tab === item.id ? 'bg-white text-[#3D1D3F]' : 'text-white/60 hover:text-white bg-transparent'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <div className="w-full sm:w-auto bg-white/10 text-white text-[11px] font-medium px-3 py-2 rounded-lg flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-white/60" /> 24 Mar – 24 Apr, 2025
                    </div>
                    <button 
                      onClick={() => {
                        onTabChange?.('accounts_receivable');
                        toast.success("Ready to generate ledger billing runs!");
                      }}
                      className="w-full sm:w-auto bg-[#C20F47] hover:bg-[#a30c3a] text-white flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg transition cursor-pointer active:scale-95 border-none whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Invoice
                    </button>
                 </div>
              </div>
            </div>

            {/* Core Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left Column (spans 3 columns) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* 3 Metric Cards — driven by the real chart of accounts (accountHeads) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Total Revenue (real tuition + canteen + transport revenue heads) */}
                  <div className="bg-[#3D1D3F] rounded-[1.5rem] p-4 text-white border border-white/10 flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow">
                    <div>
                      <span className="text-[11px] font-medium text-white/50 block mb-1">Total Revenue</span>
                      <span className="text-xl font-bold tracking-tight text-white tabular-nums">{currency} {revenueTotal.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] text-white/40">Tuition, canteen & transport</span>
                  </div>

                  {/* Card 2: Expenses (real payroll + maintenance + provisions + admin heads) */}
                  <div className="bg-white rounded-[1.5rem] p-4 border border-slate-100 flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Expenses</span>
                      <span className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{currency} {expenseTotal.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Salaries, facilities & supplies</span>
                  </div>

                  {/* Card 3: Net Position (Revenue - Expenses) */}
                  <div className={`rounded-[1.5rem] p-4 border flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow ${
                    revenueTotal - expenseTotal >= 0 ? 'bg-white border-slate-100' : 'bg-rose-50 border-rose-100'
                  }`}>
                    <div>
                      <span className={`text-[11px] font-medium block mb-1 ${revenueTotal - expenseTotal >= 0 ? 'text-slate-400' : 'text-rose-500'}`}>Net Position</span>
                      <span className={`text-xl font-bold tracking-tight tabular-nums ${revenueTotal - expenseTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {currency} {(revenueTotal - expenseTotal).toLocaleString()}
                      </span>
                    </div>
                    <span className={`text-[11px] ${revenueTotal - expenseTotal >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {revenueTotal - expenseTotal >= 0 ? 'Surplus this term' : 'Deficit this term'}
                    </span>
                  </div>

                </div>

                {/* Revenue Curve Area Chart Card — real daily fee collections from transaction history */}
                <div className="bg-white rounded-[1.5rem] p-4 lg:p-5 border border-slate-100 shadow-xs min-h-[300px] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 tracking-wide">Fee Collections</h3>
                      <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                        Last {realDailyRevenueData.length} active collection day{realDailyRevenueData.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  {realDailyRevenueData.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center py-12">
                      <div>
                        <Receipt className="w-7 h-7 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-600">No fee transactions recorded yet</p>
                        <p className="text-xs text-slate-400 mt-1">Collections will chart here once payments come in.</p>
                      </div>
                    </div>
                  ) : (
                  <div className="h-56 w-full -ml-4 pr-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realDailyRevenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueCustomGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C20F47" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#C20F47" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(v) => `${v / 1000}K`} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }} />
                        <Area type="monotone" name="Inflow trajectory" dataKey="val" stroke="#C20F47" strokeWidth={3} fillOpacity={1} fill="url(#revenueCustomGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  )}
                </div>

                {/* Recent Activities Section — real fee collections, newest first */}
                <div className="bg-white rounded-[1.5rem] p-4 lg:p-5 border border-slate-100 shadow-xs pb-8">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-base font-bold text-slate-800 tracking-wide">Recent Activity</h3>
                   </div>
                   
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm whitespace-nowrap">
                        <tbody className="divide-y divide-slate-50">
                          {recentFeeCollections.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-10 text-center text-slate-400">
                                <Receipt className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm">No fee collections recorded yet.</p>
                              </td>
                            </tr>
                          ) : (
                            recentFeeCollections.map(txn => (
                              <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-2 w-10 shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                                    </svg>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-semibold text-slate-800 text-xs block">{txn.studentName}</span>
                                  <span className="text-[10px] text-slate-400 sm:hidden">{txn.date} • {txn.reference}</span>
                                </td>
                                <td className="py-3 px-3 text-slate-400 text-xs hidden sm:table-cell tabular-nums">
                                  {txn.date}
                                </td>
                                <td className="py-3 px-3 tabular-nums text-slate-400 text-xs hidden sm:table-cell">
                                  {txn.reference}
                                </td>
                                <td className="py-3 px-3 text-emerald-600 font-semibold text-xs tabular-nums">
                                  +{currency} {txn.amount.toLocaleString()}
                                </td>
                                <td className="py-3 px-2 text-right">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> {txn.type}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                     </table>
                   </div>
                </div>

              </div>

              {/* Right Column: fee status doughnut (real) + outstanding receivables snapshot (real) */}
              <div className="lg:col-span-1 space-y-4">
                
                {/* Fee Status Doughnut — driven by real student.feeBalance data */}
                <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-xs flex flex-col items-center justify-between">
                  <div className="flex justify-between items-center w-full">
                     <span className="text-sm font-semibold text-slate-800">Fee Status</span>
                  </div>

                  <div className="relative w-40 h-40 flex items-center justify-center my-3">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie 
                           data={[
                             {name: 'Cleared', value: feeStatusBreakdown.cleared}, 
                             {name: 'Partial', value: feeStatusBreakdown.partial}, 
                             {name: 'Unpaid', value: feeStatusBreakdown.unpaid}
                           ]} 
                           cx="50%" 
                           cy="50%" 
                           innerRadius={52} 
                           outerRadius={68} 
                           stroke="none" 
                           dataKey="value" 
                           strokeWidth={0}
                         >
                            <Cell fill="#3D1D3F" />
                            <Cell fill="#F39C2A" />
                            <Cell fill="#C20F47" />
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none select-none">
                       <span className="text-xl font-bold text-slate-900 leading-none tabular-nums">{feeStatusBreakdown.total}</span>
                       <span className="text-[10px] text-slate-400 mt-1 w-20 leading-tight">Active students</span>
                     </div>
                  </div>

                  <div className="space-y-2 w-full pt-1">
                     <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-50 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm shrink-0 bg-[#3D1D3F]" />
                          <span>Fully Cleared</span>
                        </div>
                        <span className="tabular-nums text-slate-700 font-medium">{feeStatusBreakdown.cleared}</span>
                     </div>
                     
                     <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-50 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm shrink-0 bg-[#F39C2A]" />
                          <span>Partially Paid</span>
                        </div>
                        <span className="tabular-nums text-amber-600 font-medium">{feeStatusBreakdown.partial}</span>
                     </div>

                     <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm shrink-0 bg-[#C20F47]" />
                          <span>Unpaid</span>
                        </div>
                        <span className="tabular-nums text-[#C20F47] font-medium">{feeStatusBreakdown.unpaid}</span>
                     </div>
                  </div>
                </div>

                {/* Outstanding Receivables Snapshot — top 5 highest-balance students, real data */}
                <div className="bg-white rounded-[1.5rem] p-4 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="text-sm font-semibold text-slate-800">Top Outstanding Balances</h3>
                       <p className="text-[11px] text-slate-400 mt-0.5">Highest receivables right now</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                    {[...students].sort((a, b) => b.feeBalance - a.feeBalance).slice(0, 5).filter(s => s.feeBalance > 0).map(s => (
                      <div key={s.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                        <div className="min-w-0">
                          <span className="font-medium text-slate-700 block truncate">{s.name}</span>
                          <span className="text-[10px] text-slate-400">Form {s.form} {s.stream}</span>
                        </div>
                        <span className="tabular-nums font-semibold text-rose-600 shrink-0 ml-2">{currency} {s.feeBalance.toLocaleString()}</span>
                      </div>
                    ))}
                    {students.filter(s => s.feeBalance > 0).length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">All accounts cleared. No outstanding balances.</p>
                    )}
                  </div>

                  <button 
                    onClick={() => onTabChange?.('accounts_receivable')}
                    className="w-full mt-3 pt-3 border-t border-slate-100 text-xs font-medium text-[#C20F47] hover:text-[#3D1D3F] transition-colors cursor-pointer border-x-0 border-b-0 bg-transparent"
                  >
                    View all receivables →
                  </button>
                </div>

              </div>
            </div>

          </div>
        );
      })()}


      {/* TAB 2: GENERAL LEDGER */}
      {tab === 'general_ledger' && (
        <div className="space-y-4">
          
          {/* GL Sub-tab Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200 w-fit">
            <button
              onClick={() => setActiveGlSubTab('ledgers')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none whitespace-nowrap ${
                activeGlSubTab === 'ledgers' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" /> Account Heads & Ledgers
            </button>
            <button
              onClick={() => setActiveGlSubTab('printing_portal')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none whitespace-nowrap ${
                activeGlSubTab === 'printing_portal' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> Reports & Printing
            </button>
          </div>

          {activeGlSubTab === 'ledgers' && (
            <div className="space-y-4">
              {/* Header controllers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.5rem] shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#3D1D3F]" /> Books Entry & Account Heads
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Account head hierarchies, journal vouchers, and trial balance audit.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowAddJournalModal(true)}
                    className="px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border-none shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" /> Post Journal Voucher
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Account Heads Listing Table */}
                <div className="lg:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-800">
                      Chart of Accounts
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                      {accountHeads.length} heads
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-100">
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Code</th>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Account Head</th>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Category</th>
                          <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {accountHeads.map(head => (
                          <tr key={head.code} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-2.5 tabular-nums text-indigo-600 text-xs font-medium">{head.code}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{head.name}</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                head.category === 'Assets' ? 'bg-emerald-50 text-emerald-700' :
                                head.category === 'Liabilities' ? 'bg-rose-50 text-rose-700' :
                                head.category === 'Equity' ? 'bg-indigo-50 text-indigo-700' :
                                head.category === 'Revenue' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {head.category}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 tabular-nums text-right font-semibold text-slate-800 text-sm">
                              {currency} {head.balance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trial Balance Audit Panel */}
                <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.5rem] shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Trial Balance Audit</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Verifies debits equal credits under double-entry rules.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                        <span className="text-slate-500 text-xs">Total Debits</span>
                        <span className="tabular-nums text-slate-800 text-sm font-semibold">{currency} {trialBalanceSums.debits.toLocaleString()}</span>
                      </div>
                      
                      <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                        <span className="text-slate-500 text-xs">Total Credits</span>
                        <span className="tabular-nums text-slate-800 text-sm font-semibold">{currency} {trialBalanceSums.credits.toLocaleString()}</span>
                      </div>

                      <div className={`p-3 rounded-xl flex items-start gap-2 ${trialBalanceSums.balances ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {trialBalanceSums.balances ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-xs block">Books Balanced</span>
                              <p className="text-[11px] text-emerald-600 mt-0.5">
                                Debits and credits reconcile under GAAP double-entry rules.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-xs block">Trial Out of Balance</span>
                              <p className="text-[11px] text-rose-600 mt-0.5">
                                A discrepancy exists between debit and credit entries.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setActiveGlSubTab('printing_portal');
                        setActiveReportId('trial_balance');
                        toast.success("Opening Trial Balance printing portal.");
                      }}
                      className="w-full text-center px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer transition flex items-center justify-center gap-1.5 border-none"
                    >
                      <Printer className="w-3.5 h-3.5" /> Go to Printing Portal
                    </button>
                  </div>
                </div>
              </div>

              {/* Journal Voucher Register */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">
                    Journal Voucher Register
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-100">
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Voucher ID</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Date</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Reference</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Description</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Department</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Status</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Split (Dr/Cr)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {journalEntries.map(entry => (
                        <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{entry.id}</td>
                          <td className="px-4 py-2.5 tabular-nums text-slate-400 text-xs">{entry.date}</td>
                          <td className="px-4 py-2.5 tabular-nums text-indigo-600 text-xs font-medium">{entry.reference}</td>
                          <td className="px-4 py-2.5 text-slate-700">
                            <p className="font-medium text-sm">{entry.description}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">By {entry.approver}</p>
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 text-xs">{entry.department}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              entry.status === 'Audited' ? 'bg-emerald-50 text-emerald-700' :
                              entry.status === 'Posted' ? 'bg-indigo-50 text-indigo-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="space-y-1">
                              {entry.lines.map((line, idx) => (
                                <div key={idx} className="flex justify-end gap-2 text-[11px]">
                                  <span className="text-slate-400 tabular-nums">({line.accountCode})</span>
                                  {line.debit > 0 ? (
                                    <span className="font-medium text-emerald-600 tabular-nums">Dr: {line.debit.toLocaleString()}</span>
                                  ) : (
                                    <span className="font-medium text-slate-500 tabular-nums">Cr: {line.credit.toLocaleString()}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeGlSubTab === 'printing_portal' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Report Controls */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-4 shadow-sm space-y-3 h-fit">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-600" /> Report Configuration
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Select a report and filters to inspect.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1.5">Report Type</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'trial_balance', label: 'Trial Balance' },
                        { id: 'cash_book', label: 'Cash Book Ledger' },
                        { id: 'ledger_summary', label: 'Subsidiary Ledgers' },
                        { id: 'income_expenditure', label: 'Income & Expenditure' }
                      ].map(rep => (
                        <button
                          key={rep.id}
                          onClick={() => setActiveReportId(rep.id as any)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between cursor-pointer border-none ${
                            activeReportId === rep.id 
                              ? 'bg-[#3D1D3F]/5 text-[#3D1D3F]' 
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span>{rep.label}</span>
                          {activeReportId === rep.id && <Check className="w-3.5 h-3.5 text-[#3D1D3F]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Financial Year</label>
                      <select
                        value={reportYearFilter}
                        onChange={e => setReportYearFilter(e.target.value)}
                        className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                      >
                        <option value="2024/2025">2024/2025</option>
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027">2026/2027</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Month</label>
                      <select
                        value={reportMonthFilter}
                        onChange={e => setReportMonthFilter(e.target.value)}
                        className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
                      >
                        <option value="All">All (Annual)</option>
                        <option value="June">June 2026</option>
                        <option value="May">May 2026</option>
                        <option value="April">April 2026</option>
                      </select>
                    </div>
                  </div>

                  {activeReportId === 'ledger_summary' && (
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">Target Ledger Account</label>
                      <select
                        value={selectedReportAccount}
                        onChange={e => setSelectedReportAccount(e.target.value)}
                        className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-slate-800 cursor-pointer transition"
                      >
                        {accountHeads.map(head => (
                          <option key={head.code} value={head.code}>
                            ({head.code}) {head.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 bg-[#C20F47] border-none text-white rounded-lg text-xs font-medium hover:bg-[#3D1D3F] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <button
                      onClick={() => toast.success("PDF document downloaded.")}
                      className="flex-1 py-2.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Beautiful Formal Report Canvas */}
              <div id="school-print-sheet" className="lg:col-span-2 bg-[#FCFBF7] border border-[#EBE6D5] shadow-lg p-10 sm:p-14 text-[#1E293B] mx-auto w-full max-w-[800px] min-h-[950px] flex flex-col justify-between relative rounded-sm font-serif print:shadow-none print:border-none print:p-0">
                {/* Vintage Watermark security seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                  <Calculator className="w-[300px] h-[300px]" />
                </div>

                <div className="space-y-6 z-10">
                  {/* Formal Letterhead */}
                  <div className="text-center space-y-1 relative">
                    <h2 className="text-2xl font-bold tracking-tight text-[#3D1D3F] uppercase font-serif">Karega Secondary School</h2>
                    <p className="text-xs font-sans font-bold tracking-wide text-slate-500 uppercase">P.O. Box 45-10200, Kangema Murang'a | Tel: +254 712 345678</p>
                    <div className="text-xs tabular-nums tracking-wide font-bold text-indigo-700 uppercase pt-1">
                      Department of Institutional Finance & Treasury
                    </div>
                    {/* Double border separator */}
                    <div className="border-t border-double border-slate-300 mt-4 pt-1"></div>
                  </div>

                  {/* Certified Document Title & Info Block */}
                  <div className="flex justify-between items-start text-base border-b border-dashed border-slate-300 pb-4 font-sans font-medium text-slate-500">
                    <div className="space-y-1">
                      <div className="text-[13px] text-slate-500 font-bold uppercase tabular-nums">Report Designation</div>
                      <div className="text-slate-900 font-bold text-sm uppercase tracking-wide">
                        {activeReportId === 'trial_balance' && 'General ledger trial balance statement'}
                        {activeReportId === 'cash_book' && 'Consolidated dual-column cash book sheet'}
                        {activeReportId === 'ledger_summary' && `Subsidiary ledger card details`}
                        {activeReportId === 'income_expenditure' && 'Audited income & operational expenditures'}
                      </div>
                      <p className="text-[10.5px]">Financial Period: <span className="text-slate-800 font-bold">{reportYearFilter}</span> | Range: <span className="text-slate-800 font-bold">{reportMonthFilter === 'All' ? 'Annualized Full Term' : reportMonthFilter}</span></p>
                    </div>

                    <div className="text-right space-y-1 text-slate-500 select-none text-[10.5px]">
                      <div className="text-[13px] text-slate-500 font-bold uppercase tabular-nums">Registry Reference</div>
                      <div className="tabular-nums text-indigo-800 font-bold bg-slate-100 px-2 py-0.5 rounded uppercase text-xs inline-block border border-slate-200">
                        {activeReportId === 'trial_balance' && 'SEC-TB-9821'}
                        {activeReportId === 'cash_book' && 'SEC-CB-1902'}
                        {activeReportId === 'ledger_summary' && 'SEC-AC-4820'}
                        {activeReportId === 'income_expenditure' && 'SEC-IE-0924'}
                      </div>
                      <p className="text-xs tabular-nums">ASSET ID: GL-SYS-26A</p>
                    </div>
                  </div>

                  {/* TABLE OF DATA based on selection */}
                  <div className="font-serif text-[11.5px] leading-relaxed text-slate-800 space-y-4 pt-2">
                    {/* TRIAL BALANCE */}
                    {activeReportId === 'trial_balance' && (
                      <div className="space-y-4">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-900 font-sans font-bold text-slate-600 text-xs uppercase tracking-wide">
                              <th className="py-2.5 px-2">Account Code</th>
                              <th className="py-2.5 px-2">Account Head Description</th>
                              <th className="py-2.5 px-2 text-right">Debit Balance ({currency})</th>
                              <th className="py-2.5 px-2 text-right">Credit Balance ({currency})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {accountHeads.map(head => {
                              const isDebit = head.category === 'Assets' || head.category === 'Expenses';
                              return (
                                <tr key={head.code} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-2 tabular-nums text-slate-500 font-bold">{head.code}</td>
                                  <td className="py-2 px-2 font-bold text-slate-900 font-sans text-xs">{head.name}</td>
                                  <td className="py-2 px-2 text-right tabular-nums">
                                    {isDebit ? head.balance.toLocaleString() : '—'}
                                  </td>
                                  <td className="py-2 px-2 text-right tabular-nums">
                                    {!isDebit ? head.balance.toLocaleString() : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="border-t-2 border-slate-900 border-b border-slate-900 font-sans font-bold text-slate-900 bg-slate-100/50">
                              <td colSpan={2} className="py-3 px-2 uppercase font-bold text-base">Closing Reconciliation Sums</td>
                              <td className="py-3 px-2 text-right tabular-nums font-bold border-double border-b-4 border-slate-800 ">{trialBalanceSums.debits.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right tabular-nums font-bold border-double border-b-4 border-slate-800 ">{trialBalanceSums.credits.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* CASH BOOK */}
                    {activeReportId === 'cash_book' && (
                      <div className="space-y-4">
                        <p className="text-xs font-sans text-slate-500 font-semibold italic">
                          Consolidated checking statement of cash receipts (income ledger debits) versus payment vouchers (payout credits) as matched dynamically inside treasury files.
                        </p>
                        <table className="w-full text-left border-collapse text-[10.5px]">
                          <thead>
                            <tr className="border-b border-slate-900 font-sans font-bold text-slate-600 uppercase text-[10.5px]">
                              <th className="py-2 px-1">Date</th>
                              <th className="py-2 px-1">Ref ID</th>
                              <th className="py-2 px-2">Payer / Payee Description</th>
                              <th className="py-2 px-1 text-right">Debit (In)</th>
                              <th className="py-2 px-1 text-right">Credit (Out)</th>
                              <th className="py-2 px-1 text-right font-semibold">Running Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {/* Opening balance — carried from term start */}
                            <tr className="bg-slate-50 font-sans">
                              <td className="py-2 px-1 tabular-nums text-slate-500">{reportYearFilter.split('/')[0]}-06-01</td>
                              <td className="py-2 px-1 tabular-nums text-slate-500">OPENING</td>
                              <td className="py-2 px-2 font-bold text-slate-600">Term opening cash balance brought forward</td>
                              <td className="py-2 px-1 text-right">—</td>
                              <td className="py-2 px-1 text-right">—</td>
                              <td className="py-2 px-1 text-right tabular-nums font-bold">{cashBookEntries.openingBalance.toLocaleString()}</td>
                            </tr>
                            {/* Real chronological merge of fee receipts (in) and payment vouchers (out) */}
                            {cashBookEntries.rows.map((row, idx) => (
                              <tr key={`${row.ref}-${idx}`} className="hover:bg-slate-50/50">
                                <td className="py-2 px-1 tabular-nums text-slate-500">{row.date}</td>
                                <td className="py-2 px-1 tabular-nums font-bold text-slate-600">{row.ref}</td>
                                <td className="py-2 px-2 font-sans font-semibold text-xs leading-tight">{row.description}</td>
                                <td className="py-2 px-1 text-right tabular-nums text-emerald-700 font-bold">
                                  {row.debit > 0 ? `+${row.debit.toLocaleString()}` : '—'}
                                </td>
                                <td className="py-2 px-1 text-right tabular-nums text-rose-700 font-bold">
                                  {row.credit > 0 ? `-${row.credit.toLocaleString()}` : '—'}
                                </td>
                                <td className="py-2 px-1 text-right tabular-nums">{row.runningBalance.toLocaleString()}</td>
                              </tr>
                            ))}
                            {cashBookEntries.rows.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-500 font-sans font-medium">
                                  No cash movements recorded for this period yet.
                                </td>
                              </tr>
                            )}
                            <tr className="border-t-2 border-slate-900 font-sans font-bold bg-slate-100">
                              <td colSpan={3} className="py-2.5 px-2 uppercase font-bold text-base">Closing Ledger Balance</td>
                              <td colSpan={2} className="py-2.5 px-1 text-right text-slate-500 font-bold">Aggregate liquids:</td>
                              <td className="py-2.5 px-1 text-right tabular-nums font-bold border-double border-b-4 border-slate-900">{currency} {cashBookEntries.closingBalance.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* LEDGER ACCOUNT SUMMARY */}
                    {activeReportId === 'ledger_summary' && (
                      <div className="space-y-4">
                        <div className="bg-slate-100/70 p-4 border border-slate-200 rounded-2xl flex items-center justify-between font-sans">
                          <div>
                            <span className="text-[13px] text-slate-500 tabular-nums font-bold block">Ledger Sheet Category</span>
                            <span className="text-[#3D1D3F] font-bold text-sm uppercase">
                              {accountHeads.find(h => h.code === selectedReportAccount)?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[13px] text-slate-500 tabular-nums font-bold block">Consolidated Balance</span>
                            <span className="tabular-nums text-slate-950 font-bold text-sm text-xs">
                              {currency} {(accountHeads.find(h => h.code === selectedReportAccount)?.balance || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-sans text-slate-500 font-semibold italic">Listing all postings targeting Account code {selectedReportAccount} across active semesters...</p>
                        
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-900 font-sans font-bold text-slate-600 uppercase text-[13px] tracking-wide">
                              <th className="py-2 px-2">Date</th>
                              <th className="py-2 px-2">Reference</th>
                              <th className="py-2 px-2">Description narrative</th>
                              <th className="py-2 px-2 text-right">Debit (Dr)</th>
                              <th className="py-2 px-2 text-right">Credit (Cr)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 tabular-nums">
                            {journalEntries
                              .filter(entry => entry.lines.some(l => l.accountCode === selectedReportAccount))
                              .map(entry => {
                                const matchedLine = entry.lines.find(l => l.accountCode === selectedReportAccount);
                                return (
                                  <tr key={entry.id} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-2 text-slate-500">{entry.date}</td>
                                    <td className="py-2 px-2 font-bold text-indigo-700">{entry.id}</td>
                                    <td className="py-2 px-2 font-bold font-sans text-slate-800 text-xs">{entry.description}</td>
                                    <td className="py-2 px-2 text-right tabular-nums text-emerald-700 font-bold">
                                      {matchedLine?.debit !== 0 ? matchedLine?.debit.toLocaleString() : '—'}
                                    </td>
                                    <td className="py-2 px-2 text-right tabular-nums text-rose-700 font-bold">
                                      {matchedLine?.credit !== 0 ? matchedLine?.credit.toLocaleString() : '—'}
                                    </td>
                                  </tr>
                                );
                              })}
                            {journalEntries.filter(entry => entry.lines.some(l => l.accountCode === selectedReportAccount)).length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans font-medium">No direct double-entry journal postings registered for this head yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* INCOME & EXPENDITURE STATEMENT */}
                    {activeReportId === 'income_expenditure' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h5 className="font-sans font-bold text-[#3D1D3F] border-b border-slate-900 pb-1 uppercase tracking-wide text-[10.5px]">1. Operating Revenue Income Streams</h5>
                          <table className="w-full text-left border-collapse font-sans">
                            <tbody>
                              {accountHeads.filter(h => h.category === 'Revenue').map(head => (
                                <tr key={head.code} className="hover:bg-slate-50/20 text-[11.5px]">
                                  <td className="py-2 px-2 text-slate-700 font-semibold">{head.name}</td>
                                  <td className="py-2 px-2 text-right tabular-nums font-bold text-slate-900">{currency} {head.balance.toLocaleString()}</td>
                                </tr>
                              ))}
                              <tr className="border-t border-slate-900 font-sans font-bold text-slate-950 bg-slate-100">
                                <td className="py-2.5 px-2 uppercase text-[10.5px] font-bold">Total Operating Revenue</td>
                                <td className="py-2.5 px-2 text-right tabular-nums font-bold">{currency} {revenueTotal.toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="space-y-2 pt-2">
                          <h5 className="font-sans font-bold text-[#C20F47] border-b border-slate-900 pb-1 uppercase tracking-wide text-[10.5px]">2. Operational Recurrent Expenditures</h5>
                          <table className="w-full text-left border-collapse font-sans">
                            <tbody>
                              {accountHeads.filter(h => h.category === 'Expenses').map(head => (
                                <tr key={head.code} className="hover:bg-slate-50/20 text-[11.5px]">
                                  <td className="py-2 px-2 text-slate-700 font-semibold">{head.name}</td>
                                  <td className="py-2 px-2 text-right tabular-nums text-slate-900 font-medium">{currency} {head.balance.toLocaleString()}</td>
                                </tr>
                              ))}
                              <tr className="hover:bg-slate-50/20 text-[11.5px]">
                                <td className="py-2 px-2 text-slate-700 font-bold italic">Disbursed Payment Vouchers (Bus/Stationery/Food)</td>
                                <td className="py-2 px-2 text-right tabular-nums text-slate-900 font-medium">
                                  {currency} {paymentVouchers.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
                                </td>
                              </tr>
                              <tr className="border-t border-slate-900 font-sans font-bold text-slate-950 bg-slate-100">
                                <td className="py-2.5 px-2 uppercase text-[10.5px] font-bold">Total Operational Expense Debits</td>
                                <td className="py-2.5 px-2 text-right tabular-nums font-bold">
                                  {currency} {(expenseTotal + paymentVouchers.reduce((acc, p) => acc + p.amount, 0)).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="pt-4 border-t-2 border-slate-900 font-sans">
                          <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center shadow-xs">
                            <div>
                              <span className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase tabular-nums block">GAAP net surplus report</span>
                              <span className="text-base font-bold uppercase">Net Treasury Operating Balance Surplus</span>
                            </div>
                            <span className="tabular-nums text-base font-bold text-emerald-400">
                              {currency} {(revenueTotal - (expenseTotal + paymentVouchers.reduce((acc, p) => acc + p.amount, 0))).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Print Sign-offs list */}
                <div className="border-t border-slate-300 pt-8 mt-12 grid grid-cols-2 gap-6 text-slate-600 font-sans text-xs items-end">
                  <div className="space-y-6">
                    <p className="font-medium text-slate-500 leading-normal">
                      I hereby certify that this audit ledger report is a valid projection compiled directly from verified Karega Secondary School general journals and active sub-ledgers.
                    </p>
                    <div className="space-y-1">
                      <div className="border-t border-slate-400 w-44"></div>
                      <span className="font-bold uppercase text-slate-900">Mr. Jose M. Favour</span>
                      <p className="text-slate-500 font-bold uppercase tracking-wide text-[10px]">Chief Bursar & Head Auditor</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-right flex flex-col items-end">
                    <p className="font-medium text-slate-500 italic leading-normal text-right max-w-[250px]">
                      Authorized and certified under presidential institutional book oversight laws. Approved with board stamp clearance.
                    </p>
                    <div className="space-y-1 flex flex-col items-end text-right">
                      <div className="border-t border-slate-400 w-44"></div>
                      <span className="font-bold uppercase text-slate-900 block">Mr. Daniel Gitumu</span>
                      <p className="text-slate-500 font-bold uppercase tracking-wide text-[10px]">Board Principal Coordinator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POST JOURNAL MODAL OVERLAY */}
          {showAddJournalModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[1.5rem] p-5 max-w-lg w-full space-y-4 shadow-2xl text-slate-800 text-base border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">Post Double-Entry Journal Voucher</h3>
                  <button onClick={() => setShowAddJournalModal(false)} className="text-slate-500 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Voucher Reference</label>
                      <input 
                        type="text" 
                        value={newJwRef}
                        onChange={e => setNewJwRef(e.target.value)}
                        placeholder="e.g. REF-SAL-JUN"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                      <select 
                        value={newJwDept}
                        onChange={e => setNewJwDept(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800"
                      >
                        <option value="HR & Administration">HR & Administration</option>
                        <option value="Canteen Operations">Canteen Operations</option>
                        <option value="Estate Maintenance">Estate Maintenance</option>
                        <option value="Academic Department">Academic Department</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Narrative Description</label>
                    <input 
                      type="text" 
                      value={newJwDesc}
                      onChange={e => setNewJwDesc(e.target.value)}
                      placeholder="Narrative explanation for general ledger audit..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800 placeholder:text-slate-500"
                    />
                  </div>

                  {/* Lines mapping (GAAP Balance verified) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase block">Transaction Lines</span>
                    
                    {jwLines.map((line, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-3 items-end">
                        <div className="col-span-1.5">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Account Head</label>
                          <select 
                            value={line.accountCode}
                            onChange={e => {
                              const updated = [...jwLines];
                              updated[idx].accountCode = e.target.value;
                              setJwLines(updated);
                            }}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold"
                          >
                            <option value="">-- Choose Account --</option>
                            {accountHeads.map(h => (
                              <option key={h.code} value={h.code}>
                                ({h.code}) {h.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Debit (Dr)</label>
                          <input 
                            type="number" 
                            value={line.debit || ''}
                            onChange={e => {
                              const updated = [...jwLines];
                              updated[idx].debit = Number(e.target.value);
                              updated[idx].credit = 0; // standard single split
                              setJwLines(updated);
                            }}
                            placeholder="Debit"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Credit (Cr)</label>
                          <input 
                            type="number" 
                            value={line.credit || ''}
                            onChange={e => {
                              const updated = [...jwLines];
                              updated[idx].credit = Number(e.target.value);
                              updated[idx].debit = 0;
                              setJwLines(updated);
                            }}
                            placeholder="Credit"
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold tabular-nums"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-2">
                      <button 
                        onClick={() => {
                          setJwLines([...jwLines, { accountCode: '', debit: 0, credit: 0 }]);
                        }}
                        className="text-xs text-[#3D1D3F] hover:underline"
                      >
                        + Add Transaction Splitting Link
                      </button>

                      <div className="text-xs tabular-nums tracking-tight text-slate-500 font-bold">
                        Unbalanced Discrepancy Margin: 
                        <span className={`ml-1 font-bold ${jwLines.reduce((acc, l) => acc + (l.debit - l.credit), 0) === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {currency} {Math.abs(jwLines.reduce((acc, l) => acc + (l.debit - l.credit), 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowAddJournalModal(false)}
                    className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer border-none"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePostJournal}
                    className="px-4 py-2 bg-slate-900 border-none text-white rounded-xl cursor-pointer"
                  >
                    Authorize Posting
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* TAB 3: ACCOUNTS PAYABLE & EXPENDITURES */}
      {tab === 'accounts_payable' && (
        <div className="space-y-4">
          
          {/* Header with view toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm">
            <div>
              <span className="text-[10px] font-medium text-[#C20F47] px-2 py-0.5 bg-rose-50 rounded-full inline-block mb-1.5">
                Outlays & Liabilities
              </span>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C20F47]" /> Accounts Payable
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Vendor claims, purchase orders, and expenditure breakdown.
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit h-fit self-start md:self-center">
              <button
                onClick={() => setActiveApSubView('analytics')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
                  activeApSubView === 'analytics'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveApSubView('operations')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
                  activeApSubView === 'operations'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                Operations Desk ({payableInvoices.filter(i => i.status !== 'Paid').length})
              </button>
            </div>
          </div>

          {/* VIEW A: CASH & OUTFLOWS OVERVIEW — real data from accountHeads, paymentVouchers, payableInvoices */}
          {activeApSubView === 'analytics' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

              {/* LEFT: Cash position + recent outflows */}
              <div className="xl:col-span-5 space-y-4">

                <div className="bg-[#3D1D3F] text-white p-4 rounded-[1.5rem] shadow-sm">
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-wide block">Cash & Main Bank Account</span>
                  <span className="text-2xl font-bold tabular-nums block mt-1.5">{currency} {cashPositions.toLocaleString()}</span>
                  <span className="text-[11px] text-white/40 block mt-2">Real-time balance from the chart of accounts</span>
                </div>

                <div className="bg-white rounded-[1.5rem] p-4 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-800">Recent Outflows</span>
                    <button 
                      onClick={() => setActiveApSubView('operations')}
                      className="text-xs font-medium text-slate-400 hover:text-slate-700 transition cursor-pointer border-none bg-transparent"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {realRecentOutflows.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No payment vouchers recorded yet.</p>
                    ) : (
                      realRecentOutflows.map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-xs truncate">{tx.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{tx.supplier} · {tx.item}</p>
                          </div>
                          <span className="font-semibold text-rose-600 text-xs tabular-nums shrink-0 ml-2">{tx.amount}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT: Monthly outflow chart + category breakdown */}
              <div className="xl:col-span-7 space-y-4">

                <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-slate-800">Monthly Outflows</span>
                    <span className="text-[11px] text-slate-400">From recorded payment vouchers</span>
                  </div>

                  {realMonthlyOutflows.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-center">
                      <p className="text-sm text-slate-400">No voucher history to chart yet.</p>
                    </div>
                  ) : (
                    <div className="h-48 w-full -ml-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={realMonthlyOutflows} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
                          <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [`${currency} ${(v * 1000).toLocaleString()}`, 'Outflow']} />
                          <Bar dataKey="val" radius={[6, 6, 0, 0]} fill="#3D1D3F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <span className="font-semibold text-slate-800 text-sm block">Where the money goes</span>
                  
                  {realExpenseCategories.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6 bg-white rounded-[1.25rem] border border-slate-100">No vendor invoices recorded yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {realExpenseCategories.map((cat, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-3.5 rounded-[1.25rem] space-y-2.5 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm">{cat.icon}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 leading-tight">{cat.name}</p>
                          <div className="space-y-1.5">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-[#3D1D3F] h-full rounded-full transition-all duration-500" style={{ width: `${cat.pct}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[11px] tabular-nums font-medium text-slate-700">
                              <span>{cat.pct}%</span>
                              <span>{cat.amount}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* VIEW B: FUNCTIONAL LEDGER CLAIMS & SUPPLIER OPERATIONS BLOCK */}
          {/* VIEW B: FUNCTIONAL LEDGER CLAIMS & SUPPLIER OPERATIONS BLOCK */}
          {activeApSubView === 'operations' && (
            <div className="space-y-4">
              
              {/* Liabilities aging cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Total Outstanding</span>
                  <div className="text-2xl font-bold tabular-nums text-[#C20F47] mt-1.5">
                    {currency} {(payableInvoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0)).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-2">Unpaid active supplier bills</span>
                </div>

                <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Current (0–15 days)</span>
                  <div className="text-2xl font-bold tabular-nums text-slate-900 mt-1.5">
                    {currency} {apAging.current.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-2">Within standard credit terms</span>
                </div>

                <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm">
                  <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wide block">Overdue (1–60 days)</span>
                  <div className="text-2xl font-bold tabular-nums text-slate-900 mt-1.5">
                    {currency} {(apAging.d1_30 + apAging.d31_60).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#C20F47] font-medium block mt-2">Needs treasury attention</span>
                </div>

                <div className="bg-[#3D1D3F] text-white px-4 py-3.5 rounded-[1.25rem] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wide block">Purchase Order Link</span>
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5 mt-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-emerald-400" /> Procurement Active
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-2">
                    PO receipts translate directly to ledger claims.
                  </p>
                </div>
              </div>

              {/* Vendor Payables header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-4 rounded-[1.5rem] shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#C20F47]" /> Vendor Payables
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verify bills, schedule payments, link procurement orders.
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowAddPayableModal(true)}
                  className="px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border-none shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Supplier Invoice
                </button>
              </div>

              {/* Invoices List Table */}
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-100">
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Bill ID</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Vendor</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Category</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Due Date</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Amount</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Status</th>
                        <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payableInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm tabular-nums">{inv.id}</td>
                          <td className="px-4 py-2.5">
                            <p className="font-medium text-slate-700 text-sm">{inv.vendor}</p>
                            <p className="text-[11px] text-slate-400 inline-flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3 text-slate-400" /> {inv.item}
                            </p>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                              {inv.category}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 tabular-nums text-slate-400 text-xs">{inv.dueDate}</td>
                          <td className="px-4 py-2.5 tabular-nums font-semibold text-slate-800 text-sm">
                            {currency} {inv.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                              inv.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 animate-pulse' :
                              inv.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {inv.status === 'Paid' ? (
                              <div className="text-xs text-slate-400 flex flex-col items-end">
                                <span className="text-emerald-600 font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-500" /> Cleared
                                </span>
                                <span className="tabular-nums text-[11px] mt-0.5">Ref: {inv.referenceNo}</span>
                              </div>
                            ) : inv.status === 'Scheduled' ? (
                              <button 
                                onClick={() => {
                                  setScheduleDate(new Date().toISOString().split('T')[0]);
                                  setShowScheduleModal(inv.id);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-medium cursor-pointer transition border-none"
                              >
                                Dispatch Funds →
                              </button>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    const approved = payableInvoices.map(p => p.id === inv.id ? { ...p, status: 'Scheduled' as const } : p);
                                    setPayableInvoices(approved);
                                    toast.success(`Voucher approved! Ready under scheduling pipelines.`);
                                  }}
                                  className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 rounded-lg text-[11px] font-medium cursor-pointer transition"
                                >
                                  Verify
                                </button>
                                <button 
                                  onClick={() => {
                                    setScheduleDate(new Date().toISOString().split('T')[0]);
                                    setShowScheduleModal(inv.id);
                                  }}
                                  className="px-3 py-1.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg text-[11px] font-medium cursor-pointer transition border-none"
                                >
                                  Pay Now
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Connect Purchase Orders workflow matching panel */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-[1.5rem] p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 shrink-0">
                    <LinkIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wilder tabular-nums">Convert Procurement Purchase Orders (PO) to liabilities Ledger</h4>
                    <p className="text-xs text-slate-500 font-semibold font-sans">
                      The system detected 2 unlinked procurement receipts. Link them with 1-click to map to general expenditure ledgers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-150 p-5 rounded-2.5xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] bg-indigo-55 text-indigo-750 font-bold px-2 py-0.5 rounded tabular-nums uppercase border border-indigo-100">PO-2026-011</span>
                      <div className="font-bold text-slate-900 text-base mt-2 truncate">Apex Stationers Kenya</div>
                      <p className="text-xs text-slate-500 mt-0.5">Cartridges printing paper outlays</p>
                    </div>
                    <div className="text-right">
                      <div className="tabular-nums text-base font-bold text-slate-900">{currency} 34,000</div>
                      <button 
                        onClick={() => {
                          const exists = payableInvoices.some(i => i.vendor === 'Apex Stationers Kenya' && i.amount === 34000);
                          if (exists) {
                            toast.success("PO match initialized! General Accounts payable linked.");
                            return;
                          }
                          const newInv: PayableInvoice = {
                            id: 'PINV-22-L01',
                            vendor: 'Apex Stationers Kenya',
                            item: 'Term 1 Exam Printing Cartridges conversion from Procurement',
                            amount: 34000,
                            dueDate: '2026-06-15',
                            category: 'General Admin Utilities',
                            status: 'Pending Approval'
                          };
                          setPayableInvoices([newInv, ...payableInvoices]);
                          toast.success("Accounts payable ledger item created directly from Purchase Order reference!");
                        }}
                        className="text-[11px] text-indigo-600 font-bold hover:underline mt-2.5 block cursor-pointer"
                      >
                        Generate Ledger Invoice &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2.5xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] bg-indigo-55 text-indigo-750 font-bold px-2 py-0.5 rounded tabular-nums uppercase border border-indigo-100">PO-2026-012</span>
                      <div className="font-bold text-slate-900 text-base mt-2 truncate">Brookside Dairies</div>
                      <p className="text-xs text-slate-500 mt-0.5">Dry milk powder rations boarding PO</p>
                    </div>
                    <div className="text-right">
                      <div className="tabular-nums text-base font-bold text-slate-900">{currency} 85,000</div>
                      <button 
                        onClick={() => {
                          toast.success("PO Brookside match reconciled! General Accounts payable synchronized.");
                        }}
                        className="text-[11px] text-indigo-600 font-bold hover:underline mt-2.5 block cursor-pointer"
                      >
                        Generate Ledger Invoice &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ADD PAYABLE MODAL */}
          {showAddPayableModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[1.5rem] p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-800 text-base border border-slate-100 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">File Received Supplier Bill</h3>
                  <button onClick={() => setShowAddPayableModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-500 uppercase mb-1">Select Active Vendor</label>
                    <select 
                      value={newPayVendor}
                      onChange={e => setNewPayVendor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800"
                    >
                      {vendorList.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-500 uppercase mb-1">Product Descriptor Narrative</label>
                    <input 
                      type="text" 
                      value={newPayItem}
                      onChange={e => setNewPayItem(e.target.value)}
                      placeholder="e.g. 20 bags maize boarding stock"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-500 uppercase mb-1">Amount Due ({currency})</label>
                      <input 
                        type="number" 
                        value={newPayAmount || ''}
                        onChange={e => setNewPayAmount(Number(e.target.value))}
                        placeholder={`${currency} amount`}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none tabular-nums font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-slate-500 uppercase mb-1">Due Deadline</label>
                      <input 
                        type="date" 
                        value={newPayDue}
                        onChange={e => setNewPayDue(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-500 uppercase mb-1">Charge Ledger Account Head</label>
                    <select 
                      value={newPayCat}
                      onChange={e => setNewPayCat(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-850"
                    >
                      <option value="Academic Supplies">Academic Faculty Salaries / Teaching materials</option>
                      <option value="Facility Maintenance">Facility Maintenance & Estate repairs</option>
                      <option value="Boarding Food & provisions">Boarding Food & provisions</option>
                      <option value="General Admin Utilities">General Admin Utilities</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-3 border-t border-slate-100">
                  <button onClick={() => setShowAddPayableModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold cursor-pointer border-none">
                    Cancel
                  </button>
                  <button onClick={handleCreatePayable} className="px-4 py-2 bg-slate-900 border-none text-white hover:bg-slate-800 font-bold rounded-xl cursor-pointer">
                    Log Bill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULE PAYMENT DISPATCH MODAL */}
          {showScheduleModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-800 text-sm font-semibold animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">Authorize Wire Payout</h3>
                  <button onClick={() => setShowScheduleModal(null)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[13.5px] font-bold text-slate-550 uppercase mb-1">Select Funding Bank Head Account</label>
                    <select 
                      value={scheduleBankSource}
                      onChange={e => setScheduleBankSource(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-800 text-xs"
                    >
                      <option value="Cash & Main Bank Account">Cash & Main Bank Account (Liquidity: {currency} {cashPositions.toLocaleString()})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-bold text-slate-550 uppercase mb-1">Clearing Date</label>
                    <input 
                      type="date" 
                      value={scheduleDate}
                      onChange={e => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <p className="text-[11px] text-[#C20F47] bg-rose-50 p-3 rounded-2xl border border-rose-100 font-semibold leading-relaxed">
                    Warning: Clicking clear payment dispatches electronic wire instructions to the selected funding partner and instantly updates general ledger liquid balances.
                  </p>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-3 border-t border-slate-100">
                  <button onClick={() => setShowScheduleModal(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer border-none">
                    Cancel
                  </button>
                  <button onClick={() => handleExecuteScheduledPayment(showScheduleModal)} className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl cursor-pointer border-none">
                    Disburse Cash Funds
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* TAB 4: ACCOUNTS RECEIVABLE */}
      {tab === 'accounts_receivable' && (
        <div className="space-y-6">
          
          {/* Top collections health cards HUD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-[1.5rem] shadow-xs">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide block">Total Outstanding Accounts Receivable</span>
              <div className="text-2.5xl font-bold tabular-nums text-slate-900 mt-1">
                {currency} {(activeStudents.reduce((acc, s) => acc + s.feeBalance, 0)).toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 block mt-1">Uncollected cumulative pupil fee balances.</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-[1.5rem] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Term Fee Billing Coverage</span>
              <div className="text-2xl font-bold tabular-nums text-slate-900 mt-1">
                {Math.round(((activeStudents.reduce((acc, s) => acc + (s.totalFees - s.feeBalance), 0)) / 
                   (activeStudents.reduce((acc, s) => acc + s.totalFees, 0) || 1)) * 100)}% Collected
              </div>
              <span className="text-xs text-emerald-600 font-semibold block mt-1">Target term budget target: 85%.</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-[1.5rem] shadow-xs">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide block">Defaulter Accounts Listed</span>
              <div className="text-2xl font-bold tabular-nums text-slate-900 mt-1">
                {activeStudents.filter(s => s.feeBalance > 0).length} Pupils
              </div>
              <span className="text-xs text-slate-500 block mt-1">Active student files with outstanding debits.</span>
            </div>

            <div className="bg-gradient-to-br from-[#3D1D3F] to-slate-950 text-white border border-slate-800 p-5 rounded-[1.5rem] shadow-xs flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">Reconciliation Feeds Status</span>
                <span className="text-base font-bold text-slate-200 flex items-center gap-1">
                  <RefreshCw className="w-4.5 h-4.5 text-emerald-400 stroke-[2] animate-spin-slow" /> MPesa Paybill API Online
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Simulated real-time payment feed sync directly matches parent paybills.
              </p>
            </div>
          </div>

          {/* Dynamic Batch billing triggering console */}
          <div className="bg-white border-l-4 border-l-orange-500 border-y border-r border-slate-100 p-4 rounded-[1.5rem] shadow-sm space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Calculator className="w-4.5 h-4.5 text-[#3D1D3F]" /> Administrative Class-Wide Batch Billing Wizard
              </h4>
              <p className="text-[11.5px] text-slate-500 font-medium font-sans">
                Instantly debit specified billing parameters across entire Form levels or class streams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-base font-semibold text-slate-700 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <span className="text-[13px] text-slate-500 font-bold uppercase tabular-nums">Select Target Class</span>
                <select 
                  value={billingClass}
                  onChange={e => setBillingClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                >
                  <option value="All">All Portal Pupils</option>
                  <option value="Form 1">Form 1 Classes</option>
                  <option value="Form 2">Form 2 Classes</option>
                  <option value="Form 3">Form 3 Classes</option>
                  <option value="Form 4">Form 4 Classes</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] text-slate-500 font-bold uppercase tabular-nums">Debit Account Item Name</span>
                <input 
                  type="text" 
                  value={billingItem}
                  onChange={e => setBillingItem(e.target.value)}
                  placeholder="Billing category narrative..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[13px] text-slate-500 font-bold uppercase tabular-nums">Item Levy value ({currency})</span>
                <input 
                  type="number" 
                  value={billingAmount || ''}
                  onChange={e => setBillingAmount(Number(e.target.value))}
                  placeholder="Levy cost amount"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none tabular-nums font-bold text-slate-800"
                />
              </div>

              <button 
                onClick={handleTriggerBatchBilling}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center font-bold uppercase tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Trigger Debit Posting
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Smart MPesa & Bank Feeds match reconciling console */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wide text-indigo-700 tabular-nums">
                  Incoming Bank & Paybill Feed Alerts (Unmatched)
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full tabular-nums font-bold uppercase border border-emerald-100">
                  Connected API Live Feed
                </span>
              </div>

              {bankFeeds.filter(f => !f.reconciled).length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-semibold font-sans text-base flex flex-col items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <p>All incoming direct direct collections are successfully mapped to active school candidates accounts.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 font-semibold text-base text-slate-700 bg-white">
                  {bankFeeds.filter(f => !f.reconciled).map(feed => (
                    <div key={feed.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2 border border-slate-200 rounded-md tabular-nums font-bold uppercase text-[10.5px] bg-slate-50 text-slate-600 block">
                            {feed.gateway}
                          </span>
                          <span className="tabular-nums text-indigo-600 font-bold text-[10.5px]">REF: {feed.reference}</span>
                        </div>
                        <p className="text-slate-900 font-bold text-sm mt-1">{feed.senderName}</p>
                        <p className="text-[10.5px] text-slate-500 tabular-nums mt-0.5">Timestamp: {feed.timestamp}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 block tabular-nums">{currency} {feed.amount.toLocaleString()}</span>
                          <span className="text-[10.5px] text-emerald-600 font-bold block mt-0.5">Unreconciled Claim</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs text-slate-500 uppercase font-bold">Map Direct:</span>
                          <select 
                            onChange={e => {
                              if (e.target.value) {
                                handleReconcileBankFeed(feed.id, e.target.value);
                              }
                            }}
                            className="bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-750 cursor-pointer max-w-[140px] focus:outline-none"
                          >
                            <option value="">-- Match Pupil --</option>
                            {activeStudents.map(st => (
                              <option key={st.id} value={st.id}>{st.name} ({st.id})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delinquent billing Accounts: Send SMS fee reminders */}
            <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide tabular-nums">Debtors List & Outreach</h4>
                  <p className="text-[13px] text-slate-500 font-sans font-medium mt-0.5">Select candidates with outstanding deficits to broadcast reminders.</p>
                </div>
                
                {selectedDebtors.length > 0 && (
                  <button 
                    onClick={() => setShowSmsPreviewModal(true)}
                    className="px-3.5 py-2 bg-[#C20F47] hover:bg-rose-700 text-white font-bold text-[10.5px] uppercase tracking-wide rounded-xl cursor-pointer shadow-sm transition"
                  >
                    Send Reminders ({selectedDebtors.length})
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activeStudents.filter(s => s.feeBalance > 0).map(debtor => (
                  <div key={debtor.id} className="p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-between text-base hover:bg-slate-100/50 transition">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={selectedDebtors.includes(debtor.id)}
                        onChange={() => toggleSelectDebtor(debtor.id)}
                        className="rounded text-indigo-600 focus:ring-1 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[#3D1D3F] block truncate leading-snug">{debtor.name}</span>
                        <span className="text-xs text-slate-500 block tabular-nums">{debtor.form} - {debtor.stream}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="tabular-nums text-slate-900 font-bold block">{currency} {debtor.feeBalance.toLocaleString()}</span>
                      <span className="text-[12px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wide tabular-nums border border-rose-100/50">Overdue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REMINDER SMS BROADCASTER OUTLET PREVIEW MODAL */}
          {showSmsPreviewModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.5rem] p-1.5 max-w-sm w-full space-y-2 shadow-2xl text-slate-800 text-sm font-semibold">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 uppercase">Parent Outreach SMS Outbox Dispatch</h3>
                  <button onClick={() => setShowSmsPreviewModal(false)} className="text-slate-500 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase tabular-nums block">Reminders Outreach Outbox Dispatch</span>
                  
                  <div className="p-2 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl space-y-1.5">
                    <span className="text-xs text-slate-500 font-bold tabular-nums">RECIPIENTS COUNT: {selectedDebtors.length} Parents</span>
                    
                    <div className="bg-white border border-slate-200 p-3 rounded-xl tabular-nums text-slate-600 text-base leading-relaxed">
                      Dear Parent, this is an official reminder from MY SHULE APP administration. Your child's account carries an overdue academic balance. Please dispatch ${currency} payment before exam sessions.
                    </div>
                  </div>

                  <p className="text-xs text-[#C20F47] bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium leading-normal">
                    This triggers simulated direct SMS messaging dispatches to student guardian contacts linked inside active directories.
                  </p>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-3 border-t border-slate-100">
                  <button onClick={() => setShowSmsPreviewModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSendDebtorAlerts} className="px-4 py-2 bg-slate-900 text-white rounded-xl cursor-pointer">
                    Authorize SMS Dispatch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
