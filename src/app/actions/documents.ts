'use server';

import prisma from '@/lib/prisma';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getStudentDocuments() {
  try {
    const docs = await prisma.studentDocument.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        student: {
          include: {
            enrollments: {
              include: { class: true },
              orderBy: { id: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    });

    return { success: true, data: docs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadStudentDocument(data: { studentId: string, documentType: string, fileUrl: string, title?: string }) {
  try {
    const doc = await prisma.studentDocument.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        studentId: data.studentId,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
        title: data.title || data.documentType
      }
    });
    return { success: true, data: doc };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStudentDocument(id: string) {
  try {
    await prisma.studentDocument.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
