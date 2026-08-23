"use server";

import prisma from '@/lib/prisma';

export async function getStaffOptions() {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
      },
      orderBy: {
        firstName: 'asc',
      }
    });

    return staff.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      title: s.jobTitle,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}
