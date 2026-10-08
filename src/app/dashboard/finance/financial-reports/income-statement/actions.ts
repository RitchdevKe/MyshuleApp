"use server";

import prisma from "@/lib/prisma";

export async function getIncomeStatementData(financialYearId?: string) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const financialYears = await prisma.financialYear.findMany({
    where: { tenantId: tenant.id },
    orderBy: { startDate: "desc" },
  });

  const selectedYearId = financialYearId || financialYears[0]?.id || undefined;

  const accounts = await prisma.chartOfAccount.findMany({
    where: {
      tenantId: tenant.id,
      accountType: { in: ["REVENUE", "EXPENSE"] },
    },
    include: {
      journalLines: {
        where: {
          journalEntry: {
            status: "POSTED",
            ...(selectedYearId ? { financialYearId: selectedYearId } : {})
          }
        }
      }
    }
  });

  let totalRevenue = 0;
  
  const revenues: { name: string; amount: number }[] = [];
  const cogs: { name: string; amount: number }[] = [];
  const expenses: { name: string; amount: number }[] = [];

  accounts.forEach((acc) => {
    let debit = 0;
    let credit = 0;
    acc.journalLines.forEach((line) => {
      debit += line.debit;
      credit += line.credit;
    });

    if (acc.accountType === "REVENUE") {
      const balance = credit - debit;
      totalRevenue += balance;
      if (balance !== 0) revenues.push({ name: acc.accountName, amount: balance });
    } else if (acc.accountType === "EXPENSE") {
      const balance = debit - credit;
      const isCogs = acc.accountName.toLowerCase().includes("cost") || acc.accountCode.startsWith("5");
      if (balance !== 0) {
        if (isCogs) cogs.push({ name: acc.accountName, amount: balance });
        else expenses.push({ name: acc.accountName, amount: balance });
      }
    }
  });

  const totalCogs = cogs.reduce((sum, item) => sum + item.amount, 0);
  const totalOperating = expenses.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = totalRevenue - totalCogs;
  const netIncome = totalRevenue - (totalCogs + totalOperating);

  return {
    financialYears: financialYears.map(fy => ({ id: fy.id, name: fy.name })),
    selectedYearId,
    revenues,
    cogs,
    expenses,
    totalRevenue,
    totalCogs,
    totalOperating,
    grossProfit,
    netIncome,
  };
}
