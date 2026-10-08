"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";

export async function topUpFloat(accountId: string, amount: number) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  await prisma.$transaction([
    prisma.pettyCashTransaction.create({
      data: {
        accountId,
        type: TransactionType.IN,
        amount,
        description: "Float Top-up",
        date: new Date(),
      }
    }),
    prisma.pettyCashAccount.update({
      where: { id: accountId },
      data: {
        balance: { increment: amount }
      }
    })
  ]);
  
  revalidatePath("/dashboard/finance/banking-cash/petty-cash");
}

export async function logExpense(accountId: string, amount: number, description: string, category: string, requestedBy: string) {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  const fullDescription = `[${category}] ${description} (Req by: ${requestedBy})`;

  await prisma.$transaction([
    prisma.pettyCashTransaction.create({
      data: {
        accountId,
        type: TransactionType.OUT,
        amount,
        description: fullDescription,
        date: new Date(),
      }
    }),
    prisma.pettyCashAccount.update({
      where: { id: accountId },
      data: {
        balance: { decrement: amount }
      }
    })
  ]);
  
  revalidatePath("/dashboard/finance/banking-cash/petty-cash");
}
