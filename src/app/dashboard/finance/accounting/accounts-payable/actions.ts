"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBill(data: {
  vendorName: string;
  ref: string;
  amount: number;
  dueDate: string;
  status: string;
}) {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    // Find or create supplier
    let supplier = await prisma.supplier.findFirst({
      where: {
        tenantId: tenant.id,
        name: data.vendorName,
      }
    });

    if (!supplier) {
      supplier = await prisma.supplier.create({
        data: {
          tenantId: tenant.id,
          name: data.vendorName,
        }
      });
    }

    // Create dummy purchase request
    const pr = await prisma.purchaseRequest.create({
      data: {
        tenantId: tenant.id,
        requestNumber: `PR-${Date.now()}`,
        requestedBy: "System",
        description: `Auto-generated request for ${data.ref}`,
        amount: data.amount,
        status: "APPROVED",
        supplierId: supplier.id,
      }
    });

    // Create purchase order (Bill)
    await prisma.purchaseOrder.create({
      data: {
        tenantId: tenant.id,
        poNumber: data.ref,
        requestId: pr.id,
        supplierId: supplier.id,
        totalAmount: data.amount,
        status: data.status,
        deliveryDate: new Date(data.dueDate),
      }
    });

    revalidatePath("/dashboard/finance/accounting/accounts-payable");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating bill:", error);
    return { success: false, error: error.message || "Failed to create bill" };
  }
}
