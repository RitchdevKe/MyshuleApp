"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/health/records";

export async function getMedicalRecords() {
  return await prisma.medicalRecord.findMany({
    include: {
      student: {
        include: {
          enrollments: {
            include: {
              class: true,
            },
            orderBy: { academicYear: { startDate: "desc" } },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudents() {
  return await prisma.student.findMany({
    where: { status: "ACTIVE" },
    include: {
      enrollments: {
        include: { class: true },
        orderBy: { academicYear: { startDate: "desc" } },
        take: 1,
      },
      medicalRecord: { select: { id: true } },
    },
    orderBy: { firstName: "asc" },
  });
}

export async function createMedicalRecord(data: {
  studentId: string;
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  immunizations?: string;
  notes?: string;
}) {
  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { tenantId: true },
  });

  const record = await prisma.medicalRecord.create({
    data: {
      studentId: data.studentId,
      bloodGroup: data.bloodGroup || null,
      allergies: data.allergies || null,
      conditions: data.conditions || null,
      immunizations: data.immunizations || null,
      notes: data.notes || null,
      tenantId: student?.tenantId || "TENANT-1",
    },
    include: {
      student: {
        include: {
          enrollments: {
            include: { class: true },
            orderBy: { academicYear: { startDate: "desc" } },
            take: 1,
          },
        },
      },
    },
  });
  revalidatePath(REVALIDATE_PATH);
  return record;
}

export async function updateMedicalRecord(
  id: string,
  data: {
    bloodGroup?: string;
    allergies?: string;
    conditions?: string;
    immunizations?: string;
    notes?: string;
  }
) {
  const record = await prisma.medicalRecord.update({
    where: { id },
    data: {
      bloodGroup: data.bloodGroup || null,
      allergies: data.allergies || null,
      conditions: data.conditions || null,
      immunizations: data.immunizations || null,
      notes: data.notes || null,
    },
    include: {
      student: {
        include: {
          enrollments: {
            include: { class: true },
            orderBy: { academicYear: { startDate: "desc" } },
            take: 1,
          },
        },
      },
    },
  });
  revalidatePath(REVALIDATE_PATH);
  return record;
}

export async function deleteMedicalRecord(id: string) {
  await prisma.medicalRecord.delete({
    where: { id },
  });
  revalidatePath(REVALIDATE_PATH);
}
