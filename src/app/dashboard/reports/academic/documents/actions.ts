"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Replace with actual logic to get tenantId from auth session
const MOCK_TENANT_ID = "tenant-123"; 

export async function getDocumentTemplates() {
  // Try to get actual tenant from DB if possible, or just the first one
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];
  
  return await prisma.documentTemplate.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: 'asc' }
  });
}

export async function getRecentDocuments() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];
  
  return await prisma.studentDocument.findMany({
    where: { tenantId: tenant.id },
    include: {
      student: {
        select: { firstName: true, lastName: true }
      }
    },
    orderBy: { uploadedAt: 'desc' },
    take: 10
  });
}

export async function generateDocumentBatch(templateId: string, templateName: string, documentType: string) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const student = await prisma.student.findFirst({
    where: { tenantId: tenant.id }
  });

  if (!student) throw new Error("No students found to generate documents for");

  // Create a mock document generation
  await prisma.studentDocument.create({
    data: {
      tenantId: tenant.id,
      studentId: student.id,
      title: `Batch: ${templateName}`,
      documentType: documentType,
      fileUrl: `/documents/batch-${Date.now()}.pdf`,
    }
  });

  revalidatePath('/dashboard/reports/academic/documents');
  return { success: true };
}
