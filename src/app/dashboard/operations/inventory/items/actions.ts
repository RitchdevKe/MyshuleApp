"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const items = await prisma.inventoryItem.findMany({
    where: { tenantId: tenant.id },
    include: {
      inventoryBalances: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return items.map(item => {
    const qty = item.inventoryBalances.reduce((sum, bal) => sum + bal.quantity, 0);
    return {
      ...item,
      qty,
      status: qty === 0 ? "Out of Stock" : qty <= item.minStockLevel ? "Low Stock" : "In Stock",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.unitCost),
    };
  });
}

export async function createInventoryItem(data: any) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const item = await prisma.inventoryItem.create({
    data: {
      tenantId: tenant.id,
      code: data.code,
      name: data.name,
      category: data.category,
      unit: data.unit,
      minStockLevel: data.minStockLevel,
      unitCost: data.unitCost,
      status: "ACTIVE",
    },
  });

  revalidatePath("/dashboard/operations/inventory/items");
  return item;
}

export async function updateInventoryItem(id: string, data: any) {
  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      code: data.code,
      name: data.name,
      category: data.category,
      unit: data.unit,
      minStockLevel: data.minStockLevel,
      unitCost: data.unitCost,
    },
  });

  revalidatePath("/dashboard/operations/inventory/items");
  return item;
}

export async function deleteInventoryItem(id: string) {
  await prisma.inventoryItem.delete({
    where: { id },
  });

  revalidatePath("/dashboard/operations/inventory/items");
}
