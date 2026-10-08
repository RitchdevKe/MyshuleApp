"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/health/visits";

export async function getClinicVisits() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const visits = await prisma.clinicVisit.findMany({
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
    orderBy: { visitDate: "desc" },
  });

  return visits.map((v) => ({
    id: v.id,
    studentId: v.studentId,
    studentName: `${v.student.firstName} ${v.student.lastName}`,
    grade:
      v.student.enrollments[0]?.class?.name ??
      `ADM-${v.student.admissionNumber}`,
    visitDate: v.visitDate.toISOString(),
    reason: v.reason,
    diagnosis: v.diagnosis,
    treatment: v.treatment,
    handledBy: v.handledBy,
    status: v.status,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));
}

export async function getVisitStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant)
    return {
      totalVisits: 0,
      pendingVisits: 0,
      completedVisits: 0,
      referredVisits: 0,
      todayVisits: 0,
    };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [allVisits, todayVisits] = await Promise.all([
    prisma.clinicVisit.findMany({
      where: { tenantId: tenant.id },
      select: { status: true },
    }),
    prisma.clinicVisit.count({
      where: {
        tenantId: tenant.id,
        visitDate: { gte: todayStart },
      },
    }),
  ]);

  const totalVisits = allVisits.length;
  const pendingVisits = allVisits.filter((v) => v.status === "PENDING").length;
  const completedVisits = allVisits.filter(
    (v) => v.status === "COMPLETED"
  ).length;
  const referredVisits = allVisits.filter(
    (v) => v.status === "REFERRED"
  ).length;

  return {
    totalVisits,
    pendingVisits,
    completedVisits,
    referredVisits,
    todayVisits,
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

export async function createClinicVisit(data: {
  studentId: string;
  visitDate?: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  handledBy?: string;
  status?: string;
}) {
  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { tenantId: true },
  });

  if (!student) throw new Error("Student not found");

  await prisma.clinicVisit.create({
    data: {
      tenantId: student.tenantId,
      studentId: data.studentId,
      visitDate: data.visitDate ? new Date(data.visitDate) : new Date(),
      reason: data.reason,
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      handledBy: data.handledBy || null,
      status: data.status || "PENDING",
    },
  });

  revalidatePath(REVALIDATE_PATH);
}

export async function updateClinicVisit(
  id: string,
  data: {
    studentId?: string;
    visitDate?: string;
    reason?: string;
    diagnosis?: string;
    treatment?: string;
    handledBy?: string;
    status?: string;
  }
) {
  await prisma.clinicVisit.update({
    where: { id },
    data: {
      ...(data.studentId && { studentId: data.studentId }),
      ...(data.visitDate && { visitDate: new Date(data.visitDate) }),
      ...(data.reason !== undefined && { reason: data.reason }),
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      handledBy: data.handledBy || null,
      ...(data.status && { status: data.status }),
    },
  });

  revalidatePath(REVALIDATE_PATH);
}

export async function deleteClinicVisit(id: string) {
  await prisma.clinicVisit.delete({
    where: { id },
  });

  revalidatePath(REVALIDATE_PATH);
}
