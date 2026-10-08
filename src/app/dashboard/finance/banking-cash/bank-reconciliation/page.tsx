import React from "react";
import prisma from "@/lib/prisma";
import ReconciliationClient from "./ReconciliationClient";

export default async function BankReconciliationPage() {
  const bankAccounts = await prisma.bankAccount.findMany({
    select: {
      id: true,
      bankName: true,
      accountName: true,
      accountNumber: true,
    }
  });

  const transactions = await prisma.bankTransaction.findMany({
    orderBy: { date: 'desc' }
  });

  const latestReconciliation = await prisma.bankReconciliation.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <ReconciliationClient
      accounts={bankAccounts}
      transactions={transactions}
      latestReconciliation={latestReconciliation}
    />
  );
}
