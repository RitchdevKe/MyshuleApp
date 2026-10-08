"use server";

import prisma from "@/lib/prisma";

export interface MonthlyTrend {
  month: string;
  monthFullName: string;
  monthIndex: number;
  year: number;
  inflow: number;
  outflow: number;
  net: number;
  cumulativeNet: number;
  inflowCount: number;
  outflowCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  type: "INFLOW" | "OUTFLOW";
}

export interface CashflowTransaction {
  id: string;
  date: string;
  type: "INFLOW" | "OUTFLOW";
  category: string;
  description: string;
  reference: string;
  amount: number;
  paymentMethod?: string;
}

export interface CashflowSummary {
  totalInflow: number;
  totalOutflow: number;
  netCashflow: number;
  netMargin: number;
  operatingRatio: number;
  avgMonthlyInflow: number;
  avgMonthlyOutflow: number;
  avgMonthlyNet: number;
  totalTransactions: number;
  inflowGrowth: number;
  outflowGrowth: number;
}

export interface CashflowReportData {
  summary: CashflowSummary;
  monthlyTrends: MonthlyTrend[];
  inflowSources: CategoryBreakdown[];
  outflowCategories: CategoryBreakdown[];
  recentTransactions: CashflowTransaction[];
  selectedYear: number;
  selectedPeriod: string;
}

export interface FilterOptions {
  years: number[];
  selectedYear: number;
  periods: { id: string; name: string }[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export async function getFilterOptions(): Promise<FilterOptions> {
  const currentYear = new Date().getFullYear();
  const yearsSet = new Set<number>([currentYear, currentYear - 1, currentYear - 2]);

  try {
    const [academicYears, payments, purchaseOrders] = await Promise.all([
      prisma.academicYear.findMany({ select: { startDate: true, endDate: true } }),
      prisma.payment.findMany({ select: { paymentDate: true }, take: 200 }),
      prisma.purchaseOrder.findMany({ select: { issueDate: true }, take: 200 })
    ]);

    academicYears.forEach(ay => {
      if (ay.startDate) yearsSet.add(new Date(ay.startDate).getFullYear());
      if (ay.endDate) yearsSet.add(new Date(ay.endDate).getFullYear());
    });

    payments.forEach(p => {
      if (p.paymentDate) yearsSet.add(new Date(p.paymentDate).getFullYear());
    });

    purchaseOrders.forEach(po => {
      if (po.issueDate) yearsSet.add(new Date(po.issueDate).getFullYear());
    });
  } catch (err) {
    console.warn("Could not retrieve dynamic filter years from DB:", err);
  }

  const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

  return {
    years: sortedYears.length > 0 ? sortedYears : [currentYear, currentYear - 1],
    selectedYear: sortedYears[0] || currentYear,
    periods: [
      { id: "all", name: "Full Year (12 Months)" },
      { id: "h1", name: "First Half (Jan - Jun)" },
      { id: "h2", name: "Second Half (Jul - Dec)" },
      { id: "q1", name: "Q1 (Jan - Mar)" },
      { id: "q2", name: "Q2 (Apr - Jun)" },
      { id: "q3", name: "Q3 (Jul - Sep)" },
      { id: "q4", name: "Q4 (Oct - Dec)" },
    ]
  };
}

export async function getCashflowReportData(params?: {
  year?: number;
  period?: string;
}): Promise<CashflowReportData> {
  const targetYear = params?.year || new Date().getFullYear();
  const period = params?.period || "all";

  const startDate = new Date(targetYear, 0, 1, 0, 0, 0, 0);
  const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  // Month ranges for periods
  let startMonthIdx = 0;
  let endMonthIdx = 11;
  if (period === "h1") {
    endMonthIdx = 5;
  } else if (period === "h2") {
    startMonthIdx = 6;
  } else if (period === "q1") {
    endMonthIdx = 2;
  } else if (period === "q2") {
    startMonthIdx = 3;
    endMonthIdx = 5;
  } else if (period === "q3") {
    startMonthIdx = 6;
    endMonthIdx = 8;
  } else if (period === "q4") {
    startMonthIdx = 9;
  }

  // Monthly buckets initialize
  const monthlyData: Record<number, {
    inflow: number;
    outflow: number;
    inflowCount: number;
    outflowCount: number;
  }> = {};

  for (let i = startMonthIdx; i <= endMonthIdx; i++) {
    monthlyData[i] = { inflow: 0, outflow: 0, inflowCount: 0, outflowCount: 0 };
  }

  // Categories trackers
  const inflowCategoryMap: Record<string, { amount: number; count: number }> = {
    "Tuition & Student Fees": { amount: 0, count: 0 },
    "Bank Deposits & Direct Receipts": { amount: 0, count: 0 },
    "Petty Cash Inflows": { amount: 0, count: 0 },
    "General Operating Inflows": { amount: 0, count: 0 },
  };

  const outflowCategoryMap: Record<string, { amount: number; count: number }> = {
    "Staff Payroll & Remuneration": { amount: 0, count: 0 },
    "Supplier Purchase Orders": { amount: 0, count: 0 },
    "Petty Cash Disbursements": { amount: 0, count: 0 },
    "Bank Payments & Withdrawals": { amount: 0, count: 0 },
    "Transport & Fuel Costs": { amount: 0, count: 0 },
    "Repairs & Facility Maintenance": { amount: 0, count: 0 },
    "Fee Refunds & Reversals": { amount: 0, count: 0 },
  };

  const transactions: CashflowTransaction[] = [];

  try {
    // 1. Inflows: Student/Fee Payments
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: { gte: startDate, lte: endDate },
        status: { notIn: ["FAILED", "REVERSED"] }
      },
      include: {
        student: { select: { firstName: true, lastName: true, admissionNumber: true } },
        invoice: { select: { invoiceNumber: true } }
      },
      orderBy: { paymentDate: "desc" }
    });

    payments.forEach(p => {
      const pDate = new Date(p.paymentDate);
      const mIdx = pDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].inflow += p.amount;
        monthlyData[mIdx].inflowCount += 1;

        inflowCategoryMap["Tuition & Student Fees"].amount += p.amount;
        inflowCategoryMap["Tuition & Student Fees"].count += 1;

        const studentName = p.student ? `${p.student.firstName} ${p.student.lastName}` : "Student Fee";
        transactions.push({
          id: p.id,
          date: pDate.toISOString(),
          type: "INFLOW",
          category: "Tuition & Student Fees",
          description: `Payment from ${studentName}${p.invoice?.invoiceNumber ? ` (${p.invoice.invoiceNumber})` : ""}`,
          reference: p.receiptNumber || p.referenceNumber || "N/A",
          amount: p.amount,
          paymentMethod: p.paymentMethod
        });
      }
    });

    // 2. Inflows & Outflows: Bank Transactions
    const bankTx = await prisma.bankTransaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        bankAccount: { select: { bankName: true, accountNumber: true } }
      },
      orderBy: { date: "desc" }
    });

    bankTx.forEach(bt => {
      const bDate = new Date(bt.date);
      const mIdx = bDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        if (bt.type === "IN") {
          monthlyData[mIdx].inflow += bt.amount;
          monthlyData[mIdx].inflowCount += 1;
          inflowCategoryMap["Bank Deposits & Direct Receipts"].amount += bt.amount;
          inflowCategoryMap["Bank Deposits & Direct Receipts"].count += 1;

          transactions.push({
            id: bt.id,
            date: bDate.toISOString(),
            type: "INFLOW",
            category: "Bank Deposits & Direct Receipts",
            description: bt.description || `Deposit to ${bt.bankAccount.bankName}`,
            reference: bt.reference || "BT-IN",
            amount: bt.amount
          });
        } else {
          monthlyData[mIdx].outflow += bt.amount;
          monthlyData[mIdx].outflowCount += 1;
          outflowCategoryMap["Bank Payments & Withdrawals"].amount += bt.amount;
          outflowCategoryMap["Bank Payments & Withdrawals"].count += 1;

          transactions.push({
            id: bt.id,
            date: bDate.toISOString(),
            type: "OUTFLOW",
            category: "Bank Payments & Withdrawals",
            description: bt.description || `Withdrawal from ${bt.bankAccount.bankName}`,
            reference: bt.reference || "BT-OUT",
            amount: bt.amount
          });
        }
      }
    });

    // 3. Inflows & Outflows: Petty Cash Transactions
    const pettyTx = await prisma.pettyCashTransaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        account: { select: { name: true } }
      },
      orderBy: { date: "desc" }
    });

    pettyTx.forEach(pt => {
      const pDate = new Date(pt.date);
      const mIdx = pDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        if (pt.type === "IN") {
          monthlyData[mIdx].inflow += pt.amount;
          monthlyData[mIdx].inflowCount += 1;
          inflowCategoryMap["Petty Cash Inflows"].amount += pt.amount;
          inflowCategoryMap["Petty Cash Inflows"].count += 1;

          transactions.push({
            id: pt.id,
            date: pDate.toISOString(),
            type: "INFLOW",
            category: "Petty Cash Inflows",
            description: pt.description || "Petty Cash Top-up",
            reference: `PC-${pt.id.slice(0, 6)}`,
            amount: pt.amount
          });
        } else {
          monthlyData[mIdx].outflow += pt.amount;
          monthlyData[mIdx].outflowCount += 1;
          outflowCategoryMap["Petty Cash Disbursements"].amount += pt.amount;
          outflowCategoryMap["Petty Cash Disbursements"].count += 1;

          transactions.push({
            id: pt.id,
            date: pDate.toISOString(),
            type: "OUTFLOW",
            category: "Petty Cash Disbursements",
            description: pt.description || "Petty Cash Expense",
            reference: `PC-${pt.id.slice(0, 6)}`,
            amount: pt.amount
          });
        }
      }
    });

    // 4. Outflows: Purchase Orders
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: {
        issueDate: { gte: startDate, lte: endDate }
      },
      include: {
        supplier: { select: { name: true } }
      },
      orderBy: { issueDate: "desc" }
    });

    purchaseOrders.forEach(po => {
      const poDate = new Date(po.issueDate);
      const mIdx = poDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += po.totalAmount;
        monthlyData[mIdx].outflowCount += 1;
        outflowCategoryMap["Supplier Purchase Orders"].amount += po.totalAmount;
        outflowCategoryMap["Supplier Purchase Orders"].count += 1;

        transactions.push({
          id: po.id,
          date: poDate.toISOString(),
          type: "OUTFLOW",
          category: "Supplier Purchase Orders",
          description: `PO to ${po.supplier?.name || "Vendor"}`,
          reference: po.poNumber || `PO-${po.id.slice(0, 6)}`,
          amount: po.totalAmount
        });
      }
    });

    // 5. Outflows: Staff Payroll Payslips
    const payslips = await prisma.payslip.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      include: {
        staff: { select: { firstName: true, lastName: true, employeeNumber: true } },
        payrollRun: { select: { period: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    payslips.forEach(ps => {
      const psDate = new Date(ps.createdAt);
      const mIdx = psDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += ps.netPay;
        monthlyData[mIdx].outflowCount += 1;
        outflowCategoryMap["Staff Payroll & Remuneration"].amount += ps.netPay;
        outflowCategoryMap["Staff Payroll & Remuneration"].count += 1;

        const staffName = ps.staff ? `${ps.staff.firstName} ${ps.staff.lastName}` : "Staff Member";
        transactions.push({
          id: ps.id,
          date: psDate.toISOString(),
          type: "OUTFLOW",
          category: "Staff Payroll & Remuneration",
          description: `Salary payout to ${staffName} (${ps.payrollRun?.period || "Payroll"})`,
          reference: ps.staff?.employeeNumber || `PS-${ps.id.slice(0, 6)}`,
          amount: ps.netPay
        });
      }
    });

    // 6. Outflows: Refunds
    const refunds = await prisma.refund.findMany({
      where: {
        refundDate: { gte: startDate, lte: endDate }
      },
      include: {
        payment: { select: { receiptNumber: true } }
      },
      orderBy: { refundDate: "desc" }
    });

    refunds.forEach(ref => {
      const rDate = new Date(ref.refundDate);
      const mIdx = rDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += ref.amount;
        monthlyData[mIdx].outflowCount += 1;
        outflowCategoryMap["Fee Refunds & Reversals"].amount += ref.amount;
        outflowCategoryMap["Fee Refunds & Reversals"].count += 1;

        transactions.push({
          id: ref.id,
          date: rDate.toISOString(),
          type: "OUTFLOW",
          category: "Fee Refunds & Reversals",
          description: ref.reason ? `Refund: ${ref.reason}` : "Fee Refund",
          reference: ref.payment?.receiptNumber ? `REF-${ref.payment.receiptNumber}` : `REF-${ref.id.slice(0, 6)}`,
          amount: ref.amount
        });
      }
    });

    // 7. Outflows: Fuel Records
    const fuelRecords = await prisma.fuelRecord.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        vehicle: { select: { registrationNumber: true } }
      },
      orderBy: { date: "desc" }
    });

    fuelRecords.forEach(fr => {
      const fDate = new Date(fr.date);
      const mIdx = fDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += fr.cost;
        monthlyData[mIdx].outflowCount += 1;
        outflowCategoryMap["Transport & Fuel Costs"].amount += fr.cost;
        outflowCategoryMap["Transport & Fuel Costs"].count += 1;

        transactions.push({
          id: fr.id,
          date: fDate.toISOString(),
          type: "OUTFLOW",
          category: "Transport & Fuel Costs",
          description: `Fuel for ${fr.vehicle?.registrationNumber || "School Vehicle"} (${fr.amount}L)`,
          reference: `FUEL-${fr.id.slice(0, 6)}`,
          amount: fr.cost
        });
      }
    });

    // 8. Outflows: Maintenance Records
    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        asset: { select: { name: true, assetTag: true } }
      },
      orderBy: { date: "desc" }
    });

    maintenanceRecords.forEach(mr => {
      const mDate = new Date(mr.date);
      const mIdx = mDate.getMonth();
      if (mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += mr.cost;
        monthlyData[mIdx].outflowCount += 1;
        outflowCategoryMap["Repairs & Facility Maintenance"].amount += mr.cost;
        outflowCategoryMap["Repairs & Facility Maintenance"].count += 1;

        transactions.push({
          id: mr.id,
          date: mDate.toISOString(),
          type: "OUTFLOW",
          category: "Repairs & Facility Maintenance",
          description: mr.description || `Maintenance for ${mr.asset?.name || "Asset"}`,
          reference: mr.asset?.assetTag || `MNT-${mr.id.slice(0, 6)}`,
          amount: mr.cost
        });
      }
    });

    // 9. Journal Lines posted to Expense accounts
    const expenseJournalLines = await prisma.journalLine.findMany({
      where: {
        account: { accountType: "EXPENSE" },
        journalEntry: {
          status: "POSTED",
          entryDate: { gte: startDate, lte: endDate }
        }
      },
      include: {
        account: { select: { accountName: true, accountCode: true } },
        journalEntry: { select: { entryNumber: true, entryDate: true, description: true } }
      },
      orderBy: { journalEntry: { entryDate: "desc" } }
    });

    expenseJournalLines.forEach(jl => {
      const jDate = new Date(jl.journalEntry.entryDate);
      const mIdx = jDate.getMonth();
      const expenseAmount = jl.debit - jl.credit;
      if (expenseAmount > 0 && mIdx >= startMonthIdx && mIdx <= endMonthIdx) {
        monthlyData[mIdx].outflow += expenseAmount;
        monthlyData[mIdx].outflowCount += 1;

        const catName = jl.account.accountName || "Repairs & Facility Maintenance";
        if (!outflowCategoryMap[catName]) {
          outflowCategoryMap[catName] = { amount: 0, count: 0 };
        }
        outflowCategoryMap[catName].amount += expenseAmount;
        outflowCategoryMap[catName].count += 1;

        transactions.push({
          id: jl.id,
          date: jDate.toISOString(),
          type: "OUTFLOW",
          category: catName,
          description: jl.description || jl.journalEntry.description || `General Ledger Expense: ${jl.account.accountName}`,
          reference: jl.journalEntry.entryNumber || `JE-${jl.id.slice(0, 6)}`,
          amount: expenseAmount
        });
      }
    });

  } catch (err) {
    console.error("Error querying real cashflow data from DB:", err);
  }

  // Calculate Cumulative Net & Build Monthly Trends
  let cumulative = 0;
  const monthlyTrends: MonthlyTrend[] = [];

  for (let i = startMonthIdx; i <= endMonthIdx; i++) {
    const bucket = monthlyData[i] || { inflow: 0, outflow: 0, inflowCount: 0, outflowCount: 0 };
    const net = bucket.inflow - bucket.outflow;
    cumulative += net;

    monthlyTrends.push({
      month: MONTH_SHORT[i],
      monthFullName: MONTH_NAMES[i],
      monthIndex: i,
      year: targetYear,
      inflow: Math.round(bucket.inflow * 100) / 100,
      outflow: Math.round(bucket.outflow * 100) / 100,
      net: Math.round(net * 100) / 100,
      cumulativeNet: Math.round(cumulative * 100) / 100,
      inflowCount: bucket.inflowCount,
      outflowCount: bucket.outflowCount
    });
  }

  // Calculate totals
  const totalInflow = monthlyTrends.reduce((sum, m) => sum + m.inflow, 0);
  const totalOutflow = monthlyTrends.reduce((sum, m) => sum + m.outflow, 0);
  const netCashflow = totalInflow - totalOutflow;
  const activeMonthsCount = monthlyTrends.length || 1;

  const avgMonthlyInflow = totalInflow / activeMonthsCount;
  const avgMonthlyOutflow = totalOutflow / activeMonthsCount;
  const avgMonthlyNet = netCashflow / activeMonthsCount;
  const netMargin = totalInflow > 0 ? (netCashflow / totalInflow) * 100 : 0;
  const operatingRatio = totalOutflow > 0 ? totalInflow / totalOutflow : 0;

  // Process Category Breakdowns with percentages
  const inflowSources: CategoryBreakdown[] = Object.entries(inflowCategoryMap)
    .filter(([_, val]) => val.amount > 0 || totalInflow === 0)
    .map(([category, val]) => ({
      category,
      amount: Math.round(val.amount * 100) / 100,
      percentage: totalInflow > 0 ? Math.round((val.amount / totalInflow) * 1000) / 10 : 0,
      count: val.count,
      type: "INFLOW" as const
    }))
    .sort((a, b) => b.amount - a.amount);

  const outflowCategories: CategoryBreakdown[] = Object.entries(outflowCategoryMap)
    .filter(([_, val]) => val.amount > 0 || totalOutflow === 0)
    .map(([category, val]) => ({
      category,
      amount: Math.round(val.amount * 100) / 100,
      percentage: totalOutflow > 0 ? Math.round((val.amount / totalOutflow) * 1000) / 10 : 0,
      count: val.count,
      type: "OUTFLOW" as const
    }))
    .sort((a, b) => b.amount - a.amount);

  // Sort transactions by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate comparative growth (e.g. H1 vs H2 or MoM average)
  const firstHalf = monthlyTrends.slice(0, Math.ceil(monthlyTrends.length / 2));
  const secondHalf = monthlyTrends.slice(Math.ceil(monthlyTrends.length / 2));
  const sumInflow1 = firstHalf.reduce((s, m) => s + m.inflow, 0);
  const sumInflow2 = secondHalf.reduce((s, m) => s + m.inflow, 0);
  const sumOutflow1 = firstHalf.reduce((s, m) => s + m.outflow, 0);
  const sumOutflow2 = secondHalf.reduce((s, m) => s + m.outflow, 0);

  const inflowGrowth = sumInflow1 > 0 ? Math.round(((sumInflow2 - sumInflow1) / sumInflow1) * 100) : 0;
  const outflowGrowth = sumOutflow1 > 0 ? Math.round(((sumOutflow2 - sumOutflow1) / sumOutflow1) * 100) : 0;

  return {
    summary: {
      totalInflow: Math.round(totalInflow * 100) / 100,
      totalOutflow: Math.round(totalOutflow * 100) / 100,
      netCashflow: Math.round(netCashflow * 100) / 100,
      netMargin: Math.round(netMargin * 10) / 10,
      operatingRatio: Math.round(operatingRatio * 100) / 100,
      avgMonthlyInflow: Math.round(avgMonthlyInflow * 100) / 100,
      avgMonthlyOutflow: Math.round(avgMonthlyOutflow * 100) / 100,
      avgMonthlyNet: Math.round(avgMonthlyNet * 100) / 100,
      totalTransactions: transactions.length,
      inflowGrowth,
      outflowGrowth,
    },
    monthlyTrends,
    inflowSources,
    outflowCategories,
    recentTransactions: transactions.slice(0, 50),
    selectedYear: targetYear,
    selectedPeriod: period,
  };
}
