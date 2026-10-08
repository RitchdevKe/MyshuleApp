"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function createInvoice() {
  const student = await prisma.student.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID }
  });
  
  const term = await prisma.academicTerm.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  if (!student || !term) {
    throw new Error("Missing required data (student or term) to create an invoice");
  }

  const amount = Math.floor(Math.random() * 50000) + 10000;
  
  await prisma.invoice.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      studentId: student.id,
      academicTermId: term.id,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      subTotal: amount,
      discount: 0,
      totalAmount: amount,
      amountPaid: 0,
      balanceDue: amount,
      status: "UNPAID",
      notes: "Auto-generated invoice",
    }
  });

  revalidatePath("/dashboard/finance/accounting/accounts-receivable");
}
