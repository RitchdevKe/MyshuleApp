"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function addBankAccount(data: {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName?: string;
  currency?: string;
}) {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    await prisma.bankAccount.create({
      data: {
        tenantId: tenant.id,
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        branchName: data.branchName,
        currency: data.currency || "KES",
        isActive: true,
      },
    });

    revalidatePath("/dashboard/finance/banking-cash/bank-accounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding bank account:", error);
    return { success: false, error: error.message || "Failed to add account" };
  }
}

export async function recordTransfer(data: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  date: Date;
  reference?: string;
}) {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    if (data.fromAccountId === data.toAccountId) {
      throw new Error("Cannot transfer to the same account");
    }

    // Do this in a transaction
    await prisma.$transaction(async (tx) => {
      // OUT transaction
      await tx.bankTransaction.create({
        data: {
          bankAccountId: data.fromAccountId,
          type: "OUT",
          amount: data.amount,
          description: data.description,
          date: data.date,
          reference: data.reference,
        },
      });

      // IN transaction
      await tx.bankTransaction.create({
        data: {
          bankAccountId: data.toAccountId,
          type: "IN",
          amount: data.amount,
          description: data.description,
          date: data.date,
          reference: data.reference,
        },
      });
    });

    revalidatePath("/dashboard/finance/banking-cash/bank-accounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error recording transfer:", error);
    return { success: false, error: error.message || "Failed to record transfer" };
  }
}
