"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/catering/attendance";

export async function getMealAttendances(date?: string) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(targetDate);
  nextDate.setDate(targetDate.getDate() + 1);

  const attendances = await prisma.mealAttendance.findMany({
    where: {
      tenantId: tenant.id,
      date: {
        gte: targetDate,
        lt: nextDate,
      }
    },
    include: {
      student: {
        include: {
          enrollments: {
            include: { class: true },
            orderBy: { academicYear: { startDate: "desc" } },
            take: 1,
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return attendances.map((a) => ({
    id: a.id,
    studentId: a.studentId,
    studentName: `${a.student.firstName} ${a.student.lastName}`,
    grade: a.student.enrollments[0]?.class?.name ?? "N/A",
    mealType: a.mealType,
    date: a.date.toISOString(),
    status: a.status,
    scanned: a.scanned,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function getAttendanceStats(date?: string) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalExpected: 0, served: 0, percentage: 0 };

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(targetDate);
  nextDate.setDate(targetDate.getDate() + 1);

  const [totalStudents, attendances] = await Promise.all([
    prisma.student.count({ where: { tenantId: tenant.id, status: "ACTIVE" } }),
    prisma.mealAttendance.findMany({
      where: {
        tenantId: tenant.id,
        date: { gte: targetDate, lt: nextDate },
      },
      select: { status: true },
    })
  ]);

  const served = attendances.filter(a => a.status === "PRESENT").length;
  const percentage = totalStudents > 0 ? Math.round((served / totalStudents) * 100) : 0;

  return { totalExpected: totalStudents, served, percentage };
}

export async function getStudentsForDropdown() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const students = await prisma.student.findMany({
    where: { tenantId: tenant.id, status: "ACTIVE" },
    include: {
      enrollments: {
        include: { class: true },
        orderBy: { academicYear: { startDate: "desc" } },
        take: 1,
      },
    },
    orderBy: { firstName: "asc" },
  });

  return students.map((s) => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    admissionNumber: s.admissionNumber,
    grade: s.enrollments[0]?.class?.name ?? "N/A",
  }));
}

export async function createMealAttendance(data: {
  studentId: string;
  mealType: string;
  date: string;
  status?: string;
  scanned?: boolean;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.mealAttendance.create({
    data: {
      tenantId: tenant.id,
      studentId: data.studentId,
      mealType: data.mealType,
      date: new Date(data.date),
      status: data.status || "PRESENT",
      scanned: data.scanned || false,
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateMealAttendance(id: string, data: {
  mealType?: string;
  date?: string;
  status?: string;
  scanned?: boolean;
}) {
  await prisma.mealAttendance.update({
    where: { id },
    data: {
      ...(data.mealType && { mealType: data.mealType }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.status && { status: data.status }),
      ...(data.scanned !== undefined && { scanned: data.scanned }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteMealAttendance(id: string) {
  await prisma.mealAttendance.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
