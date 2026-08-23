"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getSubjects() {
  return await prisma.subject.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { name: 'asc' }
  });
}

export async function createSubject(data: { name: string; code: string; isCoreSubject: boolean }) {
  const result = await prisma.subject.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      code: data.code.toUpperCase(),
      isCoreSubject: data.isCoreSubject,
    }
  });
  revalidatePath("/dashboard/settings/academic/subjects");
  revalidatePath("/dashboard/academics/curriculum/learning-areas");
  revalidatePath("/dashboard/academics/curriculum/subjects");
  return { success: true, id: result.id };
}

export async function updateSubject(id: string, data: { name: string; code: string; isCoreSubject: boolean }) {
  await prisma.subject.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code.toUpperCase(),
      isCoreSubject: data.isCoreSubject,
    }
  });
  revalidatePath("/dashboard/settings/academic/subjects");
  revalidatePath("/dashboard/academics/curriculum/learning-areas");
  revalidatePath("/dashboard/academics/curriculum/subjects");
  return { success: true };
}

export async function deleteSubject(id: string) {
  await prisma.subject.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/academic/subjects");
  revalidatePath("/dashboard/academics/curriculum/learning-areas");
  return { success: true };
}
