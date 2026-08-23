"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DocumentType } from "@prisma/client";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getDocumentTemplates() {
  return await prisma.documentTemplate.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { name: 'asc' }
  });
}

export async function createDocumentTemplate(data: {
  name: string;
  type: DocumentType;
}) {
  const result = await prisma.documentTemplate.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      type: data.type,
      showClassTeacherRemarks: true,
      showPrincipalRemarks: true,
      showAttendance: true,
      showBehavior: true,
      footerText: "This report card is generated electronically and is valid without a signature."
    }
  });

  revalidatePath("/dashboard/settings/academic/documents");
  return { success: true, id: result.id };
}

export async function updateDocumentTemplate(id: string, data: any) {
  await prisma.documentTemplate.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/settings/academic/documents");
  return { success: true };
}
