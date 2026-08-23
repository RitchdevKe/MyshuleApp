"use server";

import prisma from '@/lib/prisma';

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNumber: true,
      },
      take: 50,
    });
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}
