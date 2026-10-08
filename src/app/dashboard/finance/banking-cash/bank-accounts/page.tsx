import React from "react";
import prisma from "@/lib/prisma";
import BankAccountsClient from "./BankAccountsClient";

export default async function BankAccountsPage() {
  const tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    return <div>No tenant found. Please set up a tenant first.</div>;
  }

  // Fetch accounts
  const rawAccounts = await prisma.bankAccount.findMany({
    where: { tenantId: tenant.id },
  });

  // Fetch transactions to calculate stats
  const allTransactions = await prisma.bankTransaction.findMany({
    where: {
      bankAccount: { tenantId: tenant.id }
    },
    include: {
      bankAccount: {
        select: {
          accountName: true,
          bankName: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const colors = ["emerald", "blue", "purple", "rose", "amber", "indigo"];
  
  const accounts = rawAccounts.map((acc, index) => {
    const accTxs = allTransactions.filter(tx => tx.bankAccountId === acc.id);
    
    // Balance calculation: IN - OUT
    const totalIn = accTxs.filter(tx => tx.type === 'IN').reduce((sum, tx) => sum + tx.amount, 0);
    const totalOut = accTxs.filter(tx => tx.type === 'OUT').reduce((sum, tx) => sum + tx.amount, 0);
    const balance = totalIn - totalOut;

    // Last 30 days stats
    const recentTxs = accTxs.filter(tx => new Date(tx.date) >= thirtyDaysAgo);
    const in30d = recentTxs.filter(tx => tx.type === 'IN').reduce((sum, tx) => sum + tx.amount, 0);
    const out30d = recentTxs.filter(tx => tx.type === 'OUT').reduce((sum, tx) => sum + tx.amount, 0);

    return {
      ...acc,
      bal: balance,
      in30d,
      out30d,
      color: colors[index % colors.length],
      type: acc.accountName.toLowerCase().includes("paybill") || acc.bankName.toLowerCase().includes("mpesa") ? "Mobile Money" 
            : acc.accountName.toLowerCase().includes("savings") ? "Savings" 
            : "Checking"
    };
  });

  // Top 50 recent transactions for the table
  const recentTransactions = allTransactions.slice(0, 50);

  return (
    <BankAccountsClient 
      accounts={accounts}
      transactions={recentTransactions}
    />
  );
}
