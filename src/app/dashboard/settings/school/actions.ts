"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "138dbb08-0e57-412f-b813-cfa271cd418c";

export async function getSchoolProfile() {
  return await prisma.tenant.findUnique({
    where: { id: DEFAULT_TENANT_ID },
  });
}

export async function updateSchoolProfile(data: any) {
  const result = await prisma.tenant.update({
    where: { id: DEFAULT_TENANT_ID },
    data,
  });
  revalidatePath("/dashboard/settings/school", "layout");
  return { success: true, result };
}

export async function getBranches() {
  return await prisma.branch.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
  });
}

export async function createBranch(data: any) {
  const result = await prisma.branch.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
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
