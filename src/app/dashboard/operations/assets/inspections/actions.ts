"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInspections(tenantId: string) {
  return prisma.inspection.findMany({
    where: { tenantId },
    include: {
      facility: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getFacilities(tenantId: string) {
  return prisma.facility.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' },
  });
}

export async function createInspection(tenantId: string, data: {
  facilityId: string;
  inspector: string;
  status: string;
  notes: string;
  date: string; // ISO date string
}) {
  await prisma.inspection.create({
    data: {
      tenantId,
      facilityId: data.facilityId,
      inspector: data.inspector,
      status: data.status,
      notes: data.notes,
      date: new Date(data.date),
    },
  });

  revalidatePath('/dashboard/operations/assets/inspections');
}

export async function deleteInspection(inspectionId: string) {
  await prisma.inspection.delete({
    where: { id: inspectionId },
  });
  revalidatePath('/dashboard/operations/assets/inspections');
}

export async function updateInspection(inspectionId: string, data: {
  facilityId: string;
  inspector: string;
  status: string;
  notes: string;
  date: string;
}) {
  await prisma.inspection.update({
    where: { id: inspectionId },
    data: {
      facilityId: data.facilityId,
      inspector: data.inspector,
      status: data.status,
      notes: data.notes,
      date: new Date(data.date),
    },
  });
  revalidatePath('/dashboard/operations/assets/inspections');
}
