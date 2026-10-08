"use server";

import prisma from "@/lib/prisma";

export async function getSummaryData(tenantId: string, year: string, term: string) {
  // Try to find the academic term if only the term name is given, 
  // or use the term as the ID if it matches.
  // Actually, standardizing on term ID is better, but let's just query what we have.
  // Wait, year/term are from the global state/URL parameters.
  // The actual schema has `academicTermId: string`. Let's assume term is the ID.
  
  const invoiceAgg = await prisma.invoice.aggregate({
    where: { 
      tenantId,
      // If term is not provided or is generic "all", we might need to handle it.
      // We will skip academicTermId filtering if it's "all" or invalid.
      // But assuming the standard structure:
      ...(term && term !== "all" ? { academicTermId: term } : {})
    },
    _sum: {
      totalAmount: true,
      amountPaid: true,
      balanceDue: true,
    }
  });

  const totalInvoiced = invoiceAgg._sum.totalAmount || 0;
  const totalCollected = invoiceAgg._sum.amountPaid || 0;
  const totalOutstanding = invoiceAgg._sum.balanceDue || 0;
  
  // Mock expenses as ~63% of total invoiced for demo purposes since model doesn't exist
  const mockExpenses = totalInvoiced * 0.63;
  const netPosition = totalCollected - mockExpenses;

  // Mock some overdue accounts
  const overdueCount = await prisma.invoice.count({
    where: {
      tenantId,
      ...(term && term !== "all" ? { academicTermId: term } : {}),
      balanceDue: { gt: 0 },
      dueDate: { lt: new Date() }
    }
  });

  const overdueAgg = await prisma.invoice.aggregate({
    where: {
      tenantId,
      ...(term && term !== "all" ? { academicTermId: term } : {}),
      balanceDue: { gt: 0 },
      dueDate: { lt: new Date() }
    },
    _sum: { balanceDue: true }
  });

  return {
    totalRevenue: totalInvoiced,
    collected: totalCollected,
    outstanding: totalOutstanding,
    expenses: mockExpenses,
    netPosition: netPosition,
    collectionRate: totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0,
    outstandingRate: totalInvoiced > 0 ? Math.round((totalOutstanding / totalInvoiced) * 100) : 0,
    expenseRate: 63,
    overdueCount: overdueCount,
    overdueAmount: overdueAgg._sum.balanceDue || 0,
  };
}

export async function getCashflowData(tenantId: string, year: string, term: string) {
  let startDate = new Date(`${year}-01-01`);
  let endDate = new Date(`${year}-12-31`);

  const academicTerm = await prisma.academicTerm.findFirst({
    where: {
      tenantId,
      name: term,
      academicYear: {
        name: year
      }
    }
  });

  if (academicTerm) {
    startDate = academicTerm.startDate;
    endDate = academicTerm.endDate;
  }

  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      paymentDate: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: {
      tenantId,
      issueDate: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dataMap: Record<string, { month: string; inflow: number; outflow: number }> = {};

  let startMonth = startDate.getMonth();
  let endMonth = endDate.getMonth();
  if (endDate.getFullYear() > startDate.getFullYear()) {
    endMonth = 11;
  }
  
  for (let i = startMonth; i <= endMonth; i++) {
    const m = months[i];
    dataMap[m] = { month: m, inflow: 0, outflow: 0 };
  }

  for (const p of payments) {
    const m = months[new Date(p.paymentDate).getMonth()];
    if (!dataMap[m]) dataMap[m] = { month: m, inflow: 0, outflow: 0 };
    dataMap[m].inflow += p.amount;
  }

  for (const po of purchaseOrders) {
    const m = months[new Date(po.issueDate).getMonth()];
    if (!dataMap[m]) dataMap[m] = { month: m, inflow: 0, outflow: 0 };
    dataMap[m].outflow += po.totalAmount;
  }

  return Object.values(dataMap).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
}

export async function getReceivablesData(tenantId: string, year: string, term: string) {
  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId,
      balanceDue: { gt: 0 }
    },
    select: {
      id: true,
      invoiceNumber: true,
      dueDate: true,
      balanceDue: true,
      status: true,
      student: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });

  const now = new Date();
  
  let current = 0;
  let days31to60 = 0;
  let days61to90 = 0;
  let over90 = 0;
  let total = 0;

  for (const inv of invoices) {
    total += inv.balanceDue;
    const diffTime = now.getTime() - new Date(inv.dueDate).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      current += inv.balanceDue;
    } else if (diffDays <= 60) {
      days31to60 += inv.balanceDue;
    } else if (diffDays <= 90) {
      days61to90 += inv.balanceDue;
    } else {
      over90 += inv.balanceDue;
    }
  }

  return {
    current,
    days31to60,
    days61to90,
    over90,
    total,
    invoicesList: invoices.slice(0, 10).map((i: any) => ({
      ...i,
      dueDate: i.dueDate.toISOString()
    }))
  };
}

export async function getBudgetData(tenantId: string, year: string, term: string) {
  // Mock budget with actual POs
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: { tenantId }
  });

  const totalPo = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  // Distribute expenses arbitrarily for demonstration if no POs exist
  const baseExpenses = totalPo > 0 ? totalPo : 1500000;

  return {
    departments: [
      { department: "Academics", percentage: Math.min(Math.round((baseExpenses * 0.4) / (2000000) * 100), 120) || 82 },
      { department: "Transport", percentage: Math.min(Math.round((baseExpenses * 0.25) / (1000000) * 100), 120) || 91 },
      { department: "ICT", percentage: Math.min(Math.round((baseExpenses * 0.2) / (500000) * 100), 150) || 113 },
      { department: "Administration", percentage: Math.min(Math.round((baseExpenses * 0.15) / (800000) * 100), 120) || 67 }
    ]
  };
}

export async function getAccountsData(tenantId: string, year: string, term: string) {
  const accounts = await prisma.bankAccount.findMany({
    where: { tenantId }
  });

  // Calculate mock balance using string character codes to be deterministic
  return accounts.map(acc => {
    let hash = 0;
    for (let i = 0; i < acc.id.length; i++) hash = acc.id.charCodeAt(i) + ((hash << 5) - hash);
    const balance = Math.abs(hash % 10000000) + 100000;
    return {
      ...acc,
      balance
    };
  });
}
