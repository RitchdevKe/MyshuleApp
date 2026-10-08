"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAdjustment(data: {
  invoiceId: string;
  description: string;
  amount: number;
}) {
  const { invoiceId, description, amount } = data;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId }
  });

  if (!invoice) throw new Error("Invoice not found");

  // Create the InvoiceItem
  const item = await prisma.invoiceItem.create({
    data: {
      invoiceId,
      description,
      amount
    }
  });

  // Update Invoice totals
  const newSubTotal = invoice.subTotal + amount;
  const newTotalAmount = invoice.totalAmount + amount;
  const newBalanceDue = invoice.balanceDue + amount;

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      subTotal: newSubTotal,
      totalAmount: newTotalAmount,
      balanceDue: newBalanceDue,
    }
  });

  revalidatePath("/dashboard/finance/fees-billing/adjustments");
  return { success: true, item };
}
