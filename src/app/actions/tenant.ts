"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "138dbb08-0e57-412f-b813-cfa271cd418c";

export async function getTenantProfile() {
  return await prisma.tenant.findUnique({
    where: { id: DEFAULT_TENANT_ID },
    include: {
      branches: true,
    }
  });
}

export async function updateTenantProfile(data: { 
  name?: string; 
  domainPrefix?: string; 
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  motto?: string;
  timezone?: string;
  dateFormat?: string;
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const result = await prisma.tenant.update({
    where: { id: DEFAULT_TENANT_ID },
    data
  });
  revalidatePath("/", "layout"); // Revalidate entire app since layout depends on it
  return { success: true, result };
}

export async function createBranch(data: { name: string; levelTypes: ("PRE_PRIMARY" | "PRIMARY" | "JUNIOR" | "SENIOR")[] }) {
  const result = await prisma.branch.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      levelTypes: data.levelTypes,
    }
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true, id: result.id };
}

export async function updateBranch(id: string, data: { name?: string; levelTypes?: ("PRE_PRIMARY" | "PRIMARY" | "JUNIOR" | "SENIOR")[] }) {
  const result = await prisma.branch.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true };
}

export async function deleteBranch(id: string) {
  await prisma.branch.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true };
}
