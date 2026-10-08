"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@prisma/client";

export async function getUnallocatedPayments() {
  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { status: 'UNALLOCATED' },
        { invoiceId: null }
      ]
    },
    orderBy: { paymentDate: 'desc' },
  });

  const totalUnallocated = payments.reduce((sum, p) => sum + p.amount, 0);

  return { payments, totalUnallocated };
}

export async function allocatePayment(paymentId: string, invoiceId: string) {
  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      invoiceId,
      status: 'ALLOCATED'
    }
  });

  revalidatePath("/dashboard/finance/collections/payment-allocation");
  return { success: true };
}
