"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  return tenant.id;
}

export async function getVehicles() {
  const tenantId = await getTenantId();
  const vehicles = await prisma.vehicle.findMany({
    where: { tenantId },
    include: {
      driver: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return vehicles;
}

export async function createVehicle(data: {
  registrationNumber: string;
  make: string;
  model: string;
  capacity: number;
  status: string;
  driverId?: string | null;
}) {
  const tenantId = await getTenantId();
  await prisma.vehicle.create({
    data: {
      registrationNumber: data.registrationNumber,
      make: data.make,
      model: data.model,
      capacity: data.capacity,
      status: data.status,
      driverId: data.driverId || null,
      tenantId,
    }
  });
  revalidatePath("/dashboard/operations/transport/vehicles");
  revalidatePath("/dashboard/operations/transport");
}

export async function updateVehicle(id: string, data: {
  registrationNumber: string;
  make: string;
  model: string;
  capacity: number;
  status: string;
  driverId?: string | null;
}) {
  await prisma.vehicle.update({
    where: { id },
    data: {
      registrationNumber: data.registrationNumber,
      make: data.make,
      model: data.model,
      capacity: data.capacity,
      status: data.status,
      driverId: data.driverId || null,
    }
  });
  revalidatePath("/dashboard/operations/transport/vehicles");
  revalidatePath("/dashboard/operations/transport");
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({
    where: { id }
  });
  revalidatePath("/dashboard/operations/transport/vehicles");
  revalidatePath("/dashboard/operations/transport");
}

export async function getVehicleStats() {
  const tenantId = await getTenantId();
  const vehicles = await prisma.vehicle.findMany({
    where: { tenantId },
    select: { status: true }
  });
  
  return {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "ACTIVE").length,
    maintenance: vehicles.filter(v => v.status === "MAINTENANCE").length
  };
}

export async function getDrivers() {
  const tenantId = await getTenantId();
  return await prisma.staff.findMany({
    where: { tenantId, status: "ACTIVE" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    }
  });
}
