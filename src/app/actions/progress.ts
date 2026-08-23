'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getStudentProgress() {
  try {
    const students = await prisma.student.findMany({
      where: { tenantId: DEFAULT_TENANT_ID, status: 'ACTIVE' },
      include: {
        enrollments: {
          include: { class: true, academicYear: true },
          orderBy: { id: 'desc' },
          take: 1
        },
        reportCards: {
          include: { exam: { include: { academicTerm: true } } },
          orderBy: { exam: { startDate: 'desc' } },
          take: 1
        }
      }
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
