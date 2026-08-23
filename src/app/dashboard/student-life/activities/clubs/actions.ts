"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Replace with a real tenant ID logic if available
const TENANT_ID = "tenant-1"; 

export async function createClub(data: { name: string, patronId: string | null }) {
  const newClub = await prisma.extracurricularActivity.create({
    data: {
      tenantId: TENANT_ID,
      name: data.name,
      activityType: "CLUB",
      patronId: data.patronId || null,
    }
  });

  revalidatePath("/dashboard/student-life/activities", "layout");
  return newClub;
}

export async function updateClub(id: string, data: { name: string, patronId: string | null }) {
  const updated = await prisma.extracurricularActivity.update({
    where: { id },
    data: {
      name: data.name,
      patronId: data.patronId || null,
    }
  });

  revalidatePath("/dashboard/student-life/activities", "layout");
  return updated;
}

export async function deleteClub(id: string) {
  await prisma.extracurricularActivity.delete({
    where: { id }
  });

  revalidatePath("/dashboard/student-life/activities", "layout");
}
