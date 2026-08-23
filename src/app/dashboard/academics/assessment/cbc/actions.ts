'use server';

import prisma from '@/lib/prisma';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getStudentsAndSubjects() {
  try {
    const students = await prisma.student.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      select: { id: true, firstName: true, lastName: true, admissionNumber: true },
      orderBy: { firstName: 'asc' },
    });

    const subjects = await prisma.subject.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    });

    return { success: true, students, subjects };
  } catch (error) {
    console.error("Error fetching students and subjects:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}
