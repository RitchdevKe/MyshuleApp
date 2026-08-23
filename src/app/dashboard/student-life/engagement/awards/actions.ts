"use server";
import prisma from '@/lib/prisma';

export async function getStudents() {
  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      admissionNumber: true,
    },
    take: 50, // Limit for performance in this UI
    orderBy: { firstName: 'asc' }
  });
  return students;
}
