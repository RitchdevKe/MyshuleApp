"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/catering/inventory";

export async function getFoodInventory() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const items = await prisma.foodInventory.findMany({
    where: { tenantId: tenant.id },
    orderBy: { itemName: "asc" },
  });

  return items.map((i) => ({
    id: i.id,
    itemName: i.itemName,
    category: i.category,
    quantity: i.quantity,
    unit: i.unit,
    minLevel: i.minLevel,
    expiryDate: i.expiryDate?.toISOString() || null,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  }));
}

export async function getFoodInventoryStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalItems: 0, lowStock: 0, outOfStock: 0, categories: 0 };

  const items = await prisma.foodInventory.findMany({
    where: { tenantId: tenant.id },
    select: { status: true, category: true },
  });

  const categories = new Set(items.map(i => i.category));

  return {
    totalItems: items.length,
    lowStock: items.filter(i => i.status === "LOW_STOCK").length,
    outOfStock: items.filter(i => i.status === "OUT_OF_STOCK").length,
    categories: categories.size,
  };
}

export async function createFoodItem(data: {
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel?: number;
  expiryDate?: string;
  status?: string;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.foodInventory.create({
    data: {
      tenantId: tenant.id,
      itemName: data.itemName,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      minLevel: data.minLevel || 0,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      status: data.status || "IN_STOCK",
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateFoodItem(id: string, data: {
  itemName?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  minLevel?: number;
  expiryDate?: string;
  status?: string;
}) {
  await prisma.foodInventory.update({
    where: { id },
    data: {
      ...(data.itemName && { itemName: data.itemName }),
      ...(data.category && { category: data.category }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.unit && { unit: data.unit }),
      ...(data.minLevel !== undefined && { minLevel: data.minLevel }),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      ...(data.status && { status: data.status }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteFoodItem(id: string) {
  await prisma.foodInventory.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
