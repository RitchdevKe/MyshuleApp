'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

async function getTenantId() {
  try {
    const session = await getSession();
    if (session?.tenantId) return session.tenantId;
  } catch (e) {
    // ignore
  }
  const tenant = await prisma.tenant.findFirst();
  return tenant?.id || DEFAULT_TENANT_ID;
}

export async function getStudentsDirectory() {
  try {
    const tenantId = await getTenantId();
    const students = await prisma.student.findMany({
      where: { tenantId },
      include: {
        enrollments: {
          include: { class: true, stream: true },
          orderBy: { id: 'desc' },
          take: 1
        },
        parents: {
          include: { parent: true }
        }
      },
      orderBy: { firstName: 'asc' }
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStudent(data: any) {
  try {
    const tenantId = await getTenantId();

    const [firstName, ...lastNames] = (data.name || "Unknown").split(" ");
    const lastName = lastNames.join(" ") || "Student";

    const student = await prisma.student.create({
      data: {
        tenantId,
        firstName,
        lastName,
        admissionNumber: data.id || `ADM${Math.floor(Math.random() * 10000)}`,
        status: "ACTIVE"
      }
    });

    revalidatePath("/dashboard/registration/admissions/directory");
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStudent(id: string, data: any) {
  try {
    const [firstName, ...lastNames] = (data.name || "Unknown").split(" ");
    const lastName = lastNames.join(" ") || "Student";

    let status = "ACTIVE";
    if (data.status === "Suspended") status = "SUSPENDED";
    if (data.status === "Alumni") status = "ALUMNI";
    if (data.status === "Transferred") status = "TRANSFERRED";

    const student = await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        status: status as any
      }
    });

    revalidatePath("/dashboard/registration/admissions/directory");
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Error updating student:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id }
    });

    revalidatePath("/dashboard/registration/admissions/directory");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return { success: false, error: error.message };
  }
}
