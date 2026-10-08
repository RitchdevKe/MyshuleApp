"use server";

import prisma from "@/lib/prisma";

export async function getBalanceSheetData(asOfDate: string) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  const tenantId = tenant.id;

  // We need to fetch JournalLines for ASSET, LIABILITY, and EQUITY accounts up to the given date.
  // The JournalEntry should ideally be POSTED.
  
  const targetDate = new Date(asOfDate);
  targetDate.setHours(23, 59, 59, 999); // end of the day

  const lines = await prisma.journalLine.findMany({
    where: {
      journalEntry: {
        tenantId,
        status: "POSTED",
        date: {
          lte: targetDate,
        },
      },
      account: {
        accountType: {
          in: ["ASSET", "LIABILITY", "EQUITY"],
        },
      },
    },
    include: {
      account: true,
    },
  });

  const assets = new Map<string, { name: string; balance: number }>();
  const liabilities = new Map<string, { name: string; balance: number }>();
  const equity = new Map<string, { name: string; balance: number }>();

  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  for (const line of lines) {
    const account = line.account;
    const type = account.accountType;
    const name = account.accountName;
    const id = account.id;

    if (type === "ASSET") {
      const balance = (line.debit || 0) - (line.credit || 0);
      if (!assets.has(id)) assets.set(id, { name, balance: 0 });
      assets.get(id)!.balance += balance;
      totalAssets += balance;
    } else if (type === "LIABILITY") {
      const balance = (line.credit || 0) - (line.debit || 0);
      if (!liabilities.has(id)) liabilities.set(id, { name, balance: 0 });
      liabilities.get(id)!.balance += balance;
      totalLiabilities += balance;
    } else if (type === "EQUITY") {
      const balance = (line.credit || 0) - (line.debit || 0);
      if (!equity.has(id)) equity.set(id, { name, balance: 0 });
      equity.get(id)!.balance += balance;
      totalEquity += balance;
    }
  }

  // Also Net Income = Revenue - Expenses affects Equity (Retained Earnings)
  const incomeLines = await prisma.journalLine.findMany({
    where: {
      journalEntry: {
        tenantId,
        status: "POSTED",
        date: {
          lte: targetDate,
        },
      },
      account: {
        accountType: {
          in: ["REVENUE", "EXPENSE"],
        },
      },
    },
    include: {
      account: true,
    },
  });

  let netIncome = 0;
  for (const line of incomeLines) {
    const type = line.account.accountType;
    if (type === "REVENUE") {
      netIncome += (line.credit || 0) - (line.debit || 0);
    } else if (type === "EXPENSE") {
      netIncome += (line.debit || 0) - (line.credit || 0); // WAIT: Revenue minus Expenses
      // netIncome = Revenue - Expense.
      // Revenue normal balance = Credit (Cr - Dr).
      // Expense normal balance = Debit (Dr - Cr).
      // So Expense decreases Net Income.
      // netIncome -= (line.debit || 0) - (line.credit || 0);
    }
  }

  // Actually, wait: Net income calculation:
  netIncome = 0;
  for (const line of incomeLines) {
    const type = line.account.accountType;
    if (type === "REVENUE") {
      netIncome += (line.credit || 0) - (line.debit || 0);
    } else if (type === "EXPENSE") {
      netIncome -= (line.debit || 0) - (line.credit || 0);
    }
  }

  totalEquity += netIncome;

  // Let's create an entry for Net Income in Equity
  if (netIncome !== 0) {
    equity.set("net_income", { name: "Net Income (Retained Earnings)", balance: netIncome });
  }

  return {
    assets: Array.from(assets.values()).filter(a => a.balance !== 0),
    liabilities: Array.from(liabilities.values()).filter(l => l.balance !== 0),
    equity: Array.from(equity.values()).filter(e => e.balance !== 0),
    totalAssets,
    totalLiabilities,
    totalEquity,
  };
}
