"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGrievances(tenantId: string) {
  return await prisma.grievance.findMany({
    where: { tenantId },
    include: { staff: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGrievance(tenantId: string, data: any) {
  await prisma.grievance.create({
    data: {
      tenantId,
      staffId: data.isAnonymous || !data.staffId ? null : data.staffId,
      isAnonymous: data.isAnonymous,
      subject: data.subject,
      category: data.category,
      severity: data.severity,
      status: data.status,
    },
  });
  revalidatePath("/dashboard/human-resources/welfare/grievances");
}

export async function updateGrievance(id: string, data: any) {
  await prisma.grievance.update({
    where: { id },
    data: {
      status: data.status,
      severity: data.severity,
      subject: data.subject,
      category: data.category,
      staffId: data.isAnonymous || !data.staffId ? null : data.staffId,
      isAnonymous: data.isAnonymous,
    },
  });
  revalidatePath("/dashboard/human-resources/welfare/grievances");
}

export async function deleteGrievance(id: string) {
  await prisma.grievance.delete({
    where: { id },
  });
  revalidatePath("/dashboard/human-resources/welfare/grievances");
}
