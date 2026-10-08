"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRefunds() {
  const refunds = await prisma.refund.findMany({
    include: {
      payment: {
        include: {
          student: true,
        },
      },
      recordedBy: true,
    },
    orderBy: {
      refundDate: "desc",
    },
  });

  return refunds;
}

export async function getPayments() {
  return await prisma.payment.findMany({
    where: {
      status: {
        notIn: ["REFUNDED", "REVERSED", "FAILED"],
      }
    },
    include: {
      student: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
}

export async function processRefund(data: { paymentId: string; amount: number; reason: string }) {
  const payment = await prisma.payment.findUnique({
    where: { id: data.paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const refund = await prisma.refund.create({
    data: {
      tenantId: payment.tenantId,
      paymentId: data.paymentId,
      amount: data.amount,
      reason: data.reason,
      recordedById: payment.recordedById, // Ideally should be the logged-in user, but this works for now if we don't have session auth
    },
  });

  // Optionally, we could update the Payment status here to REFUNDED or REVERSED
  await prisma.payment.update({
    where: { id: data.paymentId },
    data: { status: "REFUNDED" }, // Assuming REFUNDED is a valid enum value for PaymentStatus
  });

  revalidatePath("/dashboard/finance/collections/refunds-reversals");
  return refund;
}
