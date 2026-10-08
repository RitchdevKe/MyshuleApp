"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getTenantProfile() {
  const session = await getSession();
  if (!session?.tenantId) return null;
  return await prisma.tenant.findUnique({
    where: { id: session.tenantId },
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
  const session = await getSession();
  if (!session?.tenantId) throw new Error("Unauthorized");
  
  const result = await prisma.tenant.update({
    where: { id: session.tenantId },
    data
  });
  revalidatePath("/", "layout"); // Revalidate entire app since layout depends on it
  return { success: true, result };
}

export async function createBranch(data: { name: string; levelTypes: ("PRE_PRIMARY" | "PRIMARY" | "JUNIOR" | "SENIOR")[] }) {
  const session = await getSession();
  if (!session?.tenantId) throw new Error("Unauthorized");
  const result = await prisma.branch.create({
    data: {
      tenantId: session.tenantId,
      name: data.name,
      levelTypes: data.levelTypes,
    }
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true, id: result.id };
}

export async function updateBranch(id: string, data: { name?: string; levelTypes?: ("PRE_PRIMARY" | "PRIMARY" | "JUNIOR" | "SENIOR")[] }) {
  const session = await getSession();
  if (!session?.tenantId) throw new Error("Unauthorized");
  // Security: Ensure the branch belongs to the user's tenant before updating
  // For simplicity, we assume ID is a unique uuid that can't be guessed, but doing it properly is better
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (branch?.tenantId !== session.tenantId) throw new Error("Unauthorized");
  
  const result = await prisma.branch.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true };
}

export async function deleteBranch(id: string) {
  const session = await getSession();
  if (!session?.tenantId) throw new Error("Unauthorized");
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (branch?.tenantId !== session.tenantId) throw new Error("Unauthorized");
  
  await prisma.branch.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true };
}
