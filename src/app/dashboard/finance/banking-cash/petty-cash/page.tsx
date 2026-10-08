import React from "react";
import prisma from "@/lib/prisma";
import { PettyCashClient } from "./PettyCashClient";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PettyCashPage() {
  const tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Error: No tenant found.</h2>
      </div>
    );
  }

  // Find or create a default petty cash account for the tenant
  let account = await prisma.pettyCashAccount.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!account) {
    account = await prisma.pettyCashAccount.create({
      data: {
        tenantId: tenant.id,
        name: "Main Petty Cash",
        balance: 0,
      }
    });
  }

  const transactions = await prisma.pettyCashTransaction.findMany({
    where: { accountId: account.id },
    orderBy: { date: 'desc' },
  });

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const monthExpenses = transactions.filter(
    (tx) => tx.type === "OUT" && new Date(tx.date) >= start && new Date(tx.date) <= end
  );

  const spentThisMonth = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <PettyCashClient 
      account={account} 
      transactions={transactions} 
      spentThisMonth={spentThisMonth}
    />
  );
}
