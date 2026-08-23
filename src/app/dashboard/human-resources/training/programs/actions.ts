"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrainingPrograms(tenantId: string) {
  return await prisma.trainingProgram.findMany({
    where: { tenantId },
    include: { instructor: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStaffList(tenantId: string) {
  return await prisma.staff.findMany({
    where: { tenantId },
    select: { id: true, firstName: true, lastName: true },
  });
}

export async function createTrainingProgram(tenantId: string, data: any) {
  await prisma.trainingProgram.create({
    data: {
      tenantId,
      title: data.title,
      description: data.description,
      status: data.status,
      instructorId: data.instructorId || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
  revalidatePath("/dashboard/human-resources/training");
  revalidatePath("/dashboard/human-resources/training/programs");
}

export async function updateTrainingProgram(id: string, data: any) {
  await prisma.trainingProgram.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      instructorId: data.instructorId || null,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
  revalidatePath("/dashboard/human-resources/training");
  revalidatePath("/dashboard/human-resources/training/programs");
}

export async function deleteTrainingProgram(id: string) {
  await prisma.trainingProgram.delete({
    where: { id },
  });
  revalidatePath("/dashboard/human-resources/training");
  revalidatePath("/dashboard/human-resources/training/programs");
}
