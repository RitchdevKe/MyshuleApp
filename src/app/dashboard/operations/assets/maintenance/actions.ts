"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all maintenance records
export async function getMaintenanceRecords() {
  const records = await prisma.maintenanceRecord.findMany({
    include: {
      asset: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return records;
}

// Get all assets for the dropdown
export async function getAssets() {
  const assets = await prisma.asset.findMany({
    select: {
      id: true,
      name: true,
      assetTag: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return assets;
}

// Create a new maintenance record
export async function createMaintenanceRecord(data: {
  assetId: string;
  type: string;
  description: string;
  cost: number;
  date: Date;
  status: string;
  performedBy: string;
}) {
  // Use a mock tenantId since we might not have a session right now for the test
  // In a real scenario, this would come from the auth context
  // Let's get the first tenant or handle it appropriately
  const tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    throw new Error("No tenant found");
  }

  const record = await prisma.maintenanceRecord.create({
    data: {
      ...data,
      tenantId: tenant.id,
    },
  });

  revalidatePath("/dashboard/operations/assets/maintenance");
  return record;
}

// Update status
export async function updateMaintenanceStatus(id: string, status: string) {
  const record = await prisma.maintenanceRecord.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard/operations/assets/maintenance");
  return record;
}

// Delete maintenance record
export async function deleteMaintenanceRecord(id: string) {
  const record = await prisma.maintenanceRecord.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/assets/maintenance");
  return record;
}

// Update full maintenance record
export async function updateMaintenanceRecord(id: string, data: {
  assetId: string;
  type: string;
  description: string;
  cost: number;
  date: Date;
  status: string;
  performedBy: string;
}) {
  const record = await prisma.maintenanceRecord.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/operations/assets/maintenance");
  return record;
}
