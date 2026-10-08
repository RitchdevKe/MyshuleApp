"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// I'm using a hardcoded default tenantId here. In a real app we'd get this from session.


export async function getAllocations() {
  return await prisma.hostelAllocation.findMany({
    include: {
      student: true,
      hostel: true,
      room: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getStudentsForDropdown() {
  return await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      admissionNumber: true,
    },
    where: {
      status: "ACTIVE"
    }
  });
}

export async function getHostelsWithRooms() {
  return await prisma.hostel.findMany({
    where: { status: "ACTIVE" },
    include: {
      rooms: true
    }
  });
}

export async function allocateStudent(data: { studentId: string; hostelId: string; roomId: string }) {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant?.id || "tenant-1";

  // Try to find if student is already allocated
  const existing = await prisma.hostelAllocation.findFirst({
    where: {
      studentId: data.studentId,
      status: "ACTIVE"
    }
  });

  if (existing) {
    throw new Error("Student is already allocated to a room.");
  }

  // Create allocation
  await prisma.hostelAllocation.create({
    data: {
      tenantId: tenantId,
      studentId: data.studentId,
      hostelId: data.hostelId,
      roomId: data.roomId,
      status: "ACTIVE"
    }
  });

  revalidatePath("/dashboard/operations/hostel", "layout");
}

export async function vacateAllocation(id: string) {
  await prisma.hostelAllocation.update({
    where: { id },
    data: { status: "VACATED" }
  });
  revalidatePath("/dashboard/operations/hostel", "layout");
}
