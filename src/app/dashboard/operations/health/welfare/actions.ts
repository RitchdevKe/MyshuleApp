"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/health/welfare";

export async function getWelfareSessions() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const sessions = await prisma.welfareSession.findMany({
    where: { tenantId: tenant.id },
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
    orderBy: { sessionDate: "desc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    studentId: s.studentId,
    studentName: `${s.student.firstName} ${s.student.lastName}`,
    grade: s.student.enrollments[0]?.class?.name ?? "N/A",
    sessionDate: s.sessionDate.toISOString(),
    counselor: s.counselor,
    category: s.category,
    notes: s.notes,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  }));
}

export async function getWelfareStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalSessions: 0, openCases: 0, resolvedCases: 0, referredCases: 0 };

  const sessions = await prisma.welfareSession.findMany({
    where: { tenantId: tenant.id },
    select: { status: true },
  });

  return {
    totalSessions: sessions.length,
    openCases: sessions.filter(s => s.status === "OPEN").length,
    resolvedCases: sessions.filter(s => s.status === "RESOLVED").length,
    referredCases: sessions.filter(s => s.status === "REFERRED").length,
  };
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

export async function createWelfareSession(data: {
  studentId: string;
  sessionDate?: string;
  counselor: string;
  category: string;
  notes?: string;
  status?: string;
}) {
  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { tenantId: true },
  });
  if (!student) throw new Error("Student not found");

  await prisma.welfareSession.create({
    data: {
      tenantId: student.tenantId,
      studentId: data.studentId,
      sessionDate: data.sessionDate ? new Date(data.sessionDate) : new Date(),
      counselor: data.counselor,
      category: data.category,
      notes: data.notes || null,
      status: data.status || "OPEN",
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateWelfareSession(id: string, data: {
  counselor?: string;
  category?: string;
  notes?: string;
  status?: string;
  sessionDate?: string;
}) {
  await prisma.welfareSession.update({
    where: { id },
    data: {
      ...(data.counselor && { counselor: data.counselor }),
      ...(data.category && { category: data.category }),
      ...(data.sessionDate && { sessionDate: new Date(data.sessionDate) }),
      notes: data.notes || null,
      ...(data.status && { status: data.status }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteWelfareSession(id: string) {
  await prisma.welfareSession.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
