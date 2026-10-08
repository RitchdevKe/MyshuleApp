"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";

async function getDefaultTenantId() {
  const session = await getSession();
  if (!session?.tenantId) throw new Error("Unauthorized or missing tenant");
  return session.tenantId;
}

export async function getSchoolProfile() {
  const tenantId = await getDefaultTenantId();
  return await prisma.tenant.findUnique({
    where: { id: tenantId },
  });
}

export async function updateSchoolProfile(data: any) {
  try {
    const tenantId = await getDefaultTenantId();
    const result = await prisma.tenant.update({
      where: { id: tenantId },
      data,
    });
    revalidatePath("/dashboard/settings/school", "layout");
    return { success: true, result };
  } catch (error: any) {
    console.error("updateSchoolProfile error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBranches() {
  const tenantId = await getDefaultTenantId();
  return await prisma.branch.findMany({
    where: { tenantId: tenantId },
  });
}

export async function createBranch(data: any) {
  const tenantId = await getDefaultTenantId();
  const result = await prisma.branch.create({
    data: {
      tenantId: tenantId,
      ...data,
    },
  });
  revalidatePath("/dashboard/settings/school", "layout");
  return { success: true, result };
}

export async function updateBranch(id: string, data: any) {
  const result = await prisma.branch.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/settings/school", "layout");
  return { success: true, result };
}

export async function deleteBranch(id: string) {
  await prisma.branch.delete({
    where: { id },
  });
  revalidatePath("/dashboard/settings/school", "layout");
  return { success: true };
}
