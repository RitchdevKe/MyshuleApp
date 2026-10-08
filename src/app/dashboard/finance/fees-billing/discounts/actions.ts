"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyDiscount(invoiceId: string, newDiscount: number) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const totalAmount = invoice.subTotal - newDiscount;
    const balanceDue = totalAmount - invoice.amountPaid;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        discount: newDiscount,
        totalAmount: totalAmount,
        balanceDue: balanceDue,
        status: balanceDue <= 0 ? "PAID" : invoice.amountPaid > 0 ? "PARTIALLY_PAID" : "UNPAID",
      },
    });

    revalidatePath("/dashboard/finance/fees-billing/discounts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
