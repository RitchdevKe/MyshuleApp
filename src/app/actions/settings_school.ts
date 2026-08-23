"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function updateSchoolProfile(data: { 
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
  revalidatePath("/", "layout");
  return { success: true, result };
}

export async function createSchoolBranch(data: { name: string; levelTypes: ("PRE_PRIMARY" | "PRIMARY" | "JUNIOR" | "SENIOR")[] }) {
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

export async function deleteSchoolBranch(id: string) {
  await prisma.branch.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/school");
  return { success: true };
}
