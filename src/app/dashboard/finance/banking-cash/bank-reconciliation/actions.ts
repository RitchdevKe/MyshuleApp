"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function autoMatchTransactionsAction(bankAccountId: string | undefined) {
  if (!bankAccountId) return { success: false, error: "No bank account selected" };

  // Fetch unreconciled transactions
  const transactions = await prisma.bankTransaction.findMany({
    where: { bankAccountId, isReconciled: false }
  });

  if (transactions.length === 0) {
    return { success: true, count: 0 };
  }

  // Create a reconciliation record
  const reconciliation = await prisma.bankReconciliation.create({
    data: {
      bankAccountId,
      statementDate: new Date(),
      statementBalance: 0,
      systemBalance: 0,
      difference: 0,
      status: "COMPLETED",
    }
  });

  // Mark transactions as reconciled
  await prisma.bankTransaction.updateMany({
    where: { bankAccountId, isReconciled: false },
    data: { 
      isReconciled: true, 
      reconciliationId: reconciliation.id 
    }
  });

  // Calculate new balances
  const reconciledAgg = await prisma.bankTransaction.aggregate({
    where: { bankAccountId, isReconciled: true },
    _sum: { amount: true }
  });

  const systemBalance = reconciledAgg._sum.amount || 0;

  // Assuming statement balance perfectly matches for the auto-match mock
  await prisma.bankReconciliation.update({
    where: { id: reconciliation.id },
    data: {
      systemBalance,
      statementBalance: systemBalance,
      difference: 0
    }
  });

  revalidatePath("/dashboard/finance/banking-cash/bank-reconciliation");
  return { success: true, count: transactions.length };
}
