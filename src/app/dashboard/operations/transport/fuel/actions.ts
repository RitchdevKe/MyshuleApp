"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  return tenant.id;
}

export async function getFuelRecords() {
  const tenantId = await getTenantId();
  const records = await prisma.fuelRecord.findMany({
    where: { tenantId },
    include: {
      vehicle: {
        include: {
          driver: true
        }
      }
    },
    orderBy: { date: "desc" }
  });
  return records;
}

export async function createFuelRecord(data: {
  vehicleId: string;
  amount: number;
  cost: number;
  odometer?: number | null;
  notes?: string | null;
  date?: Date;
}) {
  const tenantId = await getTenantId();
  await prisma.fuelRecord.create({
    data: {
      ...data,
      tenantId,
      date: data.date || new Date(),
    }
  });
  revalidatePath("/dashboard/operations/transport/fuel");
}

export async function deleteFuelRecord(id: string) {
  await prisma.fuelRecord.delete({
    where: { id }
  });
  revalidatePath("/dashboard/operations/transport/fuel");
}

export async function getVehicles() {
  const tenantId = await getTenantId();
  return prisma.vehicle.findMany({
    where: { tenantId, status: "ACTIVE" },
    select: {
      id: true,
      registrationNumber: true,
      make: true,
      model: true,
    }
  });
}

export async function getFuelStats() {
  const tenantId = await getTenantId();
  const records = await prisma.fuelRecord.findMany({
    where: { tenantId }
  });
  
  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);
  const totalVolume = records.reduce((sum, r) => sum + (r.amount || 0), 0);
  
  return {
    totalCost,
    totalVolume,
    recordCount: records.length,
  };
}
