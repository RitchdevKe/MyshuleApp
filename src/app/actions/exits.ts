'use server';

import prisma from '@/lib/prisma';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getStudentExits() {
  try {
    const students = await prisma.student.findMany({
      where: { 
        tenantId: DEFAULT_TENANT_ID, 
        status: { in: ['ALUMNI', 'TRANSFERRED'] }
      },
      include: {
        enrollments: {
          include: { class: true },
          orderBy: { academicYear: { startDate: 'desc' } },
          take: 1
        }
      }
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
