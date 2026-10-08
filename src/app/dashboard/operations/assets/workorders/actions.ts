"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  return tenant.id;
}

export async function getWorkOrders() {
  const tenantId = await getTenantId();
  return await prisma.workOrder.findMany({
    where: { tenantId },
    include: {
      facility: true,
      asset: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFacilities() {
  const tenantId = await getTenantId();
  return await prisma.facility.findMany({
    where: { tenantId, status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
}

export async function getAssets() {
  const tenantId = await getTenantId();
  return await prisma.asset.findMany({
    where: { tenantId, status: { in: ["ACTIVE", "MAINTENANCE"] } },
    orderBy: { name: "asc" },
  });
}

export async function createWorkOrder(data: {
  title: string;
  description?: string;
  priority: string;
  assignedTo?: string;
  facilityId?: string;
  assetId?: string;
}) {
  const tenantId = await getTenantId();
  const orderNumber = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
  
  await prisma.workOrder.create({
    data: {
      tenantId,
      orderNumber,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignedTo: data.assignedTo,
      facilityId: data.facilityId || null,
      assetId: data.assetId || null,
      status: "PENDING",
    },
  });
  
  revalidatePath("/dashboard/operations/assets/workorders");
}

export async function updateWorkOrderStatus(id: string, status: string) {
  await prisma.workOrder.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard/operations/assets/workorders");
}

export async function deleteWorkOrder(id: string) {
  await prisma.workOrder.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/assets/workorders");
}
