"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClub(data: { name: string, patronId: string | null }) {
  let tenantId = "tenant-1";
  const tenant = await prisma.tenant.findFirst();
  if (tenant) {
    tenantId = tenant.id;
  }

  const newClub = await prisma.extracurricularActivity.create({
    data: {
      tenantId: tenantId,
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

export async function addMember(activityId: string, studentId: string) {
  const membership = await prisma.extracurricularMembership.create({
    data: {
      activityId,
      studentId,
      role: "MEMBER"
    }
  });
  revalidatePath("/dashboard/student-life/activities", "layout");
  return membership;
}
