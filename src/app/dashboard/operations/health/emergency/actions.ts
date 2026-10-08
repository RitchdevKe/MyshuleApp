"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/health/emergency";

export async function getEmergencyContacts() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const contacts = await prisma.emergencyContact.findMany({
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
    orderBy: { createdAt: "desc" },
  });

  return contacts.map((c) => ({
    id: c.id,
    studentId: c.studentId,
    studentName: `${c.student.firstName} ${c.student.lastName}`,
    grade: c.student.enrollments[0]?.class?.name ?? "N/A",
    name: c.name,
    relationship: c.relationship,
    phoneNumber: c.phoneNumber,
    alternativePhone: c.alternativePhone,
    email: c.email,
    priority: c.priority,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function getEmergencyStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalContacts: 0, studentsWithContacts: 0, totalStudents: 0 };

  const [totalContacts, studentsWithContacts, totalStudents] = await Promise.all([
    prisma.emergencyContact.count({ where: { tenantId: tenant.id } }),
    prisma.emergencyContact.groupBy({ by: ["studentId"], where: { tenantId: tenant.id } }).then(r => r.length),
    prisma.student.count({ where: { tenantId: tenant.id, status: "ACTIVE" } }),
  ]);

  return { totalContacts, studentsWithContacts, totalStudents };
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

export async function createEmergencyContact(data: {
  studentId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhone?: string;
  email?: string;
  priority?: number;
}) {
  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { tenantId: true },
  });
  if (!student) throw new Error("Student not found");

  await prisma.emergencyContact.create({
    data: {
      tenantId: student.tenantId,
      studentId: data.studentId,
      name: data.name,
      relationship: data.relationship,
      phoneNumber: data.phoneNumber,
      alternativePhone: data.alternativePhone || null,
      email: data.email || null,
      priority: data.priority || 1,
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateEmergencyContact(id: string, data: {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
  alternativePhone?: string;
  email?: string;
  priority?: number;
}) {
  await prisma.emergencyContact.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.relationship && { relationship: data.relationship }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      alternativePhone: data.alternativePhone || null,
      email: data.email || null,
      ...(data.priority && { priority: data.priority }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteEmergencyContact(id: string) {
  await prisma.emergencyContact.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
