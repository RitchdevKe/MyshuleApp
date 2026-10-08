"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPurchaseOrders() {
  const tenantId = "tenant-1"; // Assuming a default tenant for now
  return prisma.purchaseOrder.findMany({
    where: { tenantId },
    include: {
      supplier: true,
      request: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPurchaseRequests() {
  const tenantId = "tenant-1";
  return prisma.purchaseRequest.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSuppliers() {
  const tenantId = "tenant-1";
  return prisma.supplier.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createPurchaseOrder(data: {
  poNumber: string;
  requestId: string;
  supplierId: string;
  totalAmount: number;
  status: string;
  expectedDate?: string;
}) {
  const tenantId = "tenant-1";
  
  await prisma.purchaseOrder.create({
    data: {
      tenantId,
      poNumber: data.poNumber,
      requestId: data.requestId,
      supplierId: data.supplierId,
      totalAmount: data.totalAmount,
      status: data.status,
      deliveryDate: data.expectedDate ? new Date(data.expectedDate) : null,
    },
  });
  
  revalidatePath("/dashboard/operations/procurement/pos");
}

export async function updatePurchaseOrder(id: string, data: {
  poNumber: string;
  requestId: string;
  supplierId: string;
  totalAmount: number;
  status: string;
  expectedDate?: string;
}) {
  await prisma.purchaseOrder.update({
    where: { id },
    data: {
      poNumber: data.poNumber,
      requestId: data.requestId,
      supplierId: data.supplierId,
      totalAmount: data.totalAmount,
      status: data.status,
      deliveryDate: data.expectedDate ? new Date(data.expectedDate) : null,
    },
  });
  
  revalidatePath("/dashboard/operations/procurement/pos");
}

export async function deletePurchaseOrder(id: string) {
  await prisma.purchaseOrder.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/operations/procurement/pos");
}
