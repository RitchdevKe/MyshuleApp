"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const tenantId = "tenant-1";

export async function getGRNs() {
  return prisma.goodsReceivedNote.findMany({
    where: { tenantId },
    include: {
      purchaseOrder: true,
      supplier: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPurchaseOrders() {
  return prisma.purchaseOrder.findMany({
    where: { tenantId },
    include: { supplier: true },
    orderBy: { poNumber: "asc" },
  });
}

export async function createGRN(data: {
  grnNumber: string;
  poId: string;
  supplierId: string;
  receivedBy: string;
  condition: string;
  status: string;
  receivedDate: string;
}) {
  await prisma.goodsReceivedNote.create({
    data: {
      tenantId,
      grnNumber: data.grnNumber,
      poId: data.poId,
      supplierId: data.supplierId,
      receivedBy: data.receivedBy,
      condition: data.condition,
      status: data.status,
      receivedDate: new Date(data.receivedDate),
    },
  });

  revalidatePath("/dashboard/operations/procurement/grn");
}

export async function updateGRN(id: string, data: {
  grnNumber: string;
  poId: string;
  supplierId: string;
  receivedBy: string;
  condition: string;
  status: string;
  receivedDate: string;
}) {
  await prisma.goodsReceivedNote.update({
    where: { id },
    data: {
      grnNumber: data.grnNumber,
      poId: data.poId,
      supplierId: data.supplierId,
      receivedBy: data.receivedBy,
      condition: data.condition,
      status: data.status,
      receivedDate: new Date(data.receivedDate),
    },
  });

  revalidatePath("/dashboard/operations/procurement/grn");
}

export async function deleteGRN(id: string) {
  await prisma.goodsReceivedNote.delete({
    where: { id },
  });

  revalidatePath("/dashboard/operations/procurement/grn");
}
