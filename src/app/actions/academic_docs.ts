"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function deleteDocumentTemplate(id: string) {
  await prisma.documentTemplate.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/academic/documents");
  return { success: true };
}

export async function setDefaultDocumentTemplate(id: string, type: string) {
  // Unset previous defaults for this type
  await prisma.documentTemplate.updateMany({
    where: { tenantId: DEFAULT_TENANT_ID, type: type as any },
    data: { isDefault: false }
  });

  // Set the new default
  await prisma.documentTemplate.update({
    where: { id },
    data: { isDefault: true }
  });

  revalidatePath("/dashboard/settings/academic/documents");
  return { success: true };
}
