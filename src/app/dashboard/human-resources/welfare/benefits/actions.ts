"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBenefits(tenantId: string) {
  return await prisma.benefit.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBenefit(tenantId: string, data: any) {
  await prisma.benefit.create({
    data: {
      tenantId,
      title: data.title,
      provider: data.provider,
      type: data.type,
      limit: data.limit,
      status: data.status,
    },
  });
  revalidatePath("/dashboard/human-resources/welfare/benefits");
}

export async function updateBenefit(id: string, data: any) {
  await prisma.benefit.update({
    where: { id },
    data: {
      title: data.title,
      provider: data.provider,
      type: data.type,
      limit: data.limit,
      status: data.status,
    },
  });
  revalidatePath("/dashboard/human-resources/welfare/benefits");
}

export async function deleteBenefit(id: string) {
  await prisma.benefit.delete({
    where: { id },
  });
  revalidatePath("/dashboard/human-resources/welfare/benefits");
}
