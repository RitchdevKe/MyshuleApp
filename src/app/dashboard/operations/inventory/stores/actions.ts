"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  return tenant.id;
}

export async function getStores() {
  const tenantId = await getTenantId();

  const stores = await prisma.store.findMany({
    where: { tenantId },
    include: {
      manager: true,
      inventoryBalances: {
        include: {
          item: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return stores.map((store) => {
    let itemsCount = 0;
    let totalValue = 0;
    
    // Count unique items (where quantity > 0)
    store.inventoryBalances.forEach((bal) => {
      if (bal.quantity > 0) {
        itemsCount++;
      }
      totalValue += bal.quantity * bal.item.unitCost;
    });

    return {
      id: store.id,
      name: store.name,
      location: store.location || "N/A",
      managerId: store.managerId,
      managerName: store.manager ? `${store.manager.firstName} ${store.manager.lastName}` : "Unassigned",
      itemsCount,
      totalValue,
      capacity: 0, // Not present in DB, will mock as random or 0. Since we have itemsCount, maybe fake capacity?
      rawCapacity: 0, 
    };
  });
}

export async function createStore(data: { name: string; location: string; managerId?: string }) {
  const tenantId = await getTenantId();
  await prisma.store.create({
    data: {
      tenantId,
      name: data.name,
      location: data.location,
      managerId: data.managerId || null,
    },
  });
  revalidatePath("/dashboard/operations/inventory/stores");
}

export async function updateStore(id: string, data: { name: string; location: string; managerId?: string }) {
  const tenantId = await getTenantId();
  // Ensure the store belongs to the tenant
  const existing = await prisma.store.findUnique({ where: { id } });
  if (existing?.tenantId !== tenantId) throw new Error("Store not found");

  await prisma.store.update({
    where: { id },
    data: {
      name: data.name,
      location: data.location,
      managerId: data.managerId || null,
    },
  });
  revalidatePath("/dashboard/operations/inventory/stores");
}

export async function deleteStore(id: string) {
  const tenantId = await getTenantId();
  // Ensure the store belongs to the tenant
  const existing = await prisma.store.findUnique({ where: { id } });
  if (existing?.tenantId !== tenantId) throw new Error("Store not found");

  await prisma.store.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/inventory/stores");
}

export async function getStaffList() {
  const tenantId = await getTenantId();
  const staff = await prisma.staff.findMany({
    where: { tenantId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: 'asc' },
  });
  return staff.map(s => ({ id: s.id, name: `${s.firstName} ${s.lastName}` }));
}
