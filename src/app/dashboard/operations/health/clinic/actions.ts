"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/health/clinic";

export async function getClinicInventory() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const items = await prisma.clinicInventory.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    ...item,
    expiryDate: item.expiryDate ? item.expiryDate.toISOString() : null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export async function getClinicStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalStock: 0, lowStockItems: 0, outOfStockItems: 0 };

  const items = await prisma.clinicInventory.findMany({
    where: { tenantId: tenant.id },
    select: { quantity: true, status: true },
  });

  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStockItems = items.filter(
    (i) => i.status === "OUT_OF_STOCK"
  ).length;

  return { totalStock, lowStockItems, outOfStockItems };
}

export async function createClinicInventoryItem(data: {
  itemName: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  status?: string;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const item = await prisma.clinicInventory.create({
    data: {
      tenantId: tenant.id,
      itemName: data.itemName,
      quantity: data.quantity,
      unit: data.unit || null,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      status: data.status || "IN_STOCK",
    },
  });

  revalidatePath(REVALIDATE_PATH);
  return item;
}

export async function updateClinicInventoryItem(
  id: string,
  data: {
    itemName: string;
    quantity: number;
    unit?: string;
    expiryDate?: string;
    status?: string;
  }
) {
  const item = await prisma.clinicInventory.update({
    where: { id },
    data: {
      itemName: data.itemName,
      quantity: data.quantity,
      unit: data.unit || null,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      status: data.status || "IN_STOCK",
    },
  });

  revalidatePath(REVALIDATE_PATH);
  return item;
}

export async function deleteClinicInventoryItem(id: string) {
  await prisma.clinicInventory.delete({
    where: { id },
  });

  revalidatePath(REVALIDATE_PATH);
}
