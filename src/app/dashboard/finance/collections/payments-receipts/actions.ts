"use server";

import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPayments(tenantId: string) {
  const payments = await prisma.payment.findMany({
    where: { tenantId },
    include: {
      student: true,
      invoice: true,
    },
    orderBy: { paymentDate: "desc" },
  });
  return payments;
}

export async function getPaymentStats(tenantId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todaysCollections, mpesaVolume, unallocatedFunds] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        tenantId,
        paymentDate: { gte: today },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        tenantId,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        tenantId,
        status: PaymentStatus.UNALLOCATED,
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    todaysCollections: todaysCollections._sum.amount || 0,
    mpesaVolume: mpesaVolume._sum.amount || 0,
    unallocatedFunds: unallocatedFunds._sum.amount || 0,
  };
}

export async function createPayment(data: {
  tenantId: string;
  studentId?: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  recordedById: string;
}) {
  const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`;
  const status = data.invoiceId ? PaymentStatus.ALLOCATED : PaymentStatus.UNALLOCATED;

  let actualRecordedById = data.recordedById;
  if (actualRecordedById === "dummy-user-id") {
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No user found to record payment.");
    }
    actualRecordedById = user.id;
  }

  const payment = await prisma.payment.create({
    data: {
      tenantId: data.tenantId,
      receiptNumber,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
      recordedById: actualRecordedById,
      status,
      studentId: data.studentId || null,
      invoiceId: data.invoiceId || null,
    },
  });

  if (data.invoiceId) {
    // Optionally update invoice amountPaid
    const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } });
    if (invoice) {
      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          amountPaid: invoice.amountPaid + data.amount,
          balanceDue: invoice.totalAmount - (invoice.amountPaid + data.amount),
          status: invoice.totalAmount - (invoice.amountPaid + data.amount) <= 0 ? "PAID" : "PARTIAL",
        },
      });
    }
  }

  revalidatePath("/dashboard/finance/collections/payments-receipts");
  return payment;
}
