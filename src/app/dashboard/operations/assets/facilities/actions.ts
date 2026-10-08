"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFacilities(tenantId: string) {
  return await prisma.facility.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFacility(data: {
  tenantId: string;
  name: string;
  type: string;
  capacity?: number;
  location?: string;
  status: string;
}) {
  const facility = await prisma.facility.create({
    data,
  });
  revalidatePath("/dashboard/operations/assets/facilities");
  return facility;
}

export async function updateFacility(
  id: string,
  data: {
    name?: string;
    type?: string;
    capacity?: number;
    location?: string;
    status?: string;
  }
) {
  const facility = await prisma.facility.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/operations/assets/facilities");
  return facility;
}

export async function deleteFacility(id: string) {
  await prisma.facility.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/assets/facilities");
}
