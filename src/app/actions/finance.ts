"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getBankAccounts() {
  return await prisma.bankAccount.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { bankName: 'asc' }
  });
}

export async function createBankAccount(data: {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  currency: string;
}) {
  const result = await prisma.bankAccount.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      branchName: data.branchName,
      currency: data.currency,
      isActive: true,
    }
  });
  revalidatePath("/dashboard/settings/finance/accounts");
  return { success: true, id: result.id };
}

export async function deleteBankAccount(id: string) {
  await prisma.bankAccount.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/finance/accounts");
  return { success: true };
}

export async function getPaymentGateways() {
  return await prisma.paymentGateway.findMany({
    where: { tenantId: DEFAULT_TENANT_ID }
  });
}

export async function createPaymentGateway(data: {
  providerName: string;
  paybillNumber: string;
}) {
  const result = await prisma.paymentGateway.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      providerName: data.providerName,
      paybillNumber: data.paybillNumber,
      isActive: true,
    }
  });
  revalidatePath("/dashboard/settings/finance/accounts");
  return { success: true, id: result.id };
}

export async function deletePaymentGateway(id: string) {
  await prisma.paymentGateway.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/finance/accounts");
  return { success: true };
}

export async function getFeeStructures() {
  return await prisma.feeStructure.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      academicYear: true,
      class: true,
      items: true
    },
    orderBy: [
      { academicYear: { name: 'desc' } },
      { class: { name: 'asc' } }
    ]
  });
}

export async function createFeeStructure(data: {
  academicYearId: string;
  classId: string;
  name: string;
  items: { name: string; amount: number }[];
}) {
  const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

  const result = await prisma.feeStructure.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      academicYearId: data.academicYearId,
      classId: data.classId,
      name: data.name,
      totalAmount,
      items: {
        create: data.items.map(item => ({
          name: item.name,
          amount: item.amount
        }))
      }
    }
  });

  revalidatePath("/dashboard/settings/finance/fee-structures");
  return { success: true, id: result.id };
}

export async function deleteFeeStructure(id: string) {
  await prisma.feeStructure.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/finance/fee-structures");
  return { success: true };
}

export async function recordPayment(data: {
  invoiceId: string;
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "MOBILE_MONEY" | "CREDIT_CARD" | "CHEQUE";
  referenceNumber?: string;
  notes?: string;
  recordedById?: string;
}) {
  const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } });
  if (!invoice) throw new Error("Invoice not found");

  const newAmountPaid = invoice.amountPaid + data.amount;
  const newBalanceDue = invoice.totalAmount - newAmountPaid;
  
  let status = invoice.status;
  if (newBalanceDue <= 0) {
    status = "PAID";
  } else if (newAmountPaid > 0) {
    status = "PARTIALLY_PAID";
  }

  // Use a default user if not provided
  let userId = data.recordedById;
  if (!userId) {
    const user = await prisma.user.findFirst({ where: { email: 'admin@school.com' } });
    userId = user?.id;
    if (!userId) {
      const anyUser = await prisma.user.findFirst();
      userId = anyUser?.id;
    }
  }

  const result = await prisma.$transaction([
    prisma.payment.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        referenceNumber: data.referenceNumber,
        notes: data.notes,
        recordedById: userId!,
        receiptNumber: `REC-${Date.now()}`
      }
    }),
    prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: status as any
      }
    })
  ]);

  revalidatePath("/dashboard/registration/parents/finance");
  return { success: true, paymentId: result[0].id };
}
