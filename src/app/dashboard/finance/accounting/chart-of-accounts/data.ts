"use server";

import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export async function getChartOfAccounts(tenantId: string) {
  const accounts = await prisma.chartOfAccount.findMany({
    where: { tenantId },
    include: {
      journalLines: true,
    },
    orderBy: { accountCode: "asc" },
  });

  const accountTypes = [
    { type: "ASSET", label: "Assets" },
    { type: "LIABILITY", label: "Liabilities" },
    { type: "EQUITY", label: "Equity" },
    { type: "REVENUE", label: "Revenue" },
    { type: "EXPENSE", label: "Expenses" },
  ];

  const result = accountTypes.map((typeObj) => {
    const typeAccounts = accounts.filter((a) => a.accountType === typeObj.type);
    
    let groupBalance = 0;
    const formattedAccounts = typeAccounts.map((acc) => {
      let balance = 0;
      acc.journalLines.forEach((jl) => {
        if (typeObj.type === "ASSET" || typeObj.type === "EXPENSE") {
          balance += jl.debit - jl.credit;
        } else {
          balance += jl.credit - jl.debit;
        }
      });
      groupBalance += balance;

      return {
        id: acc.id,
        code: acc.accountCode,
        name: acc.accountName,
        balance,
      };
    });

    return {
      type: typeObj.label,
      rawType: typeObj.type,
      balance: groupBalance,
      accounts: formattedAccounts,
    };
  });

  return result;
}
