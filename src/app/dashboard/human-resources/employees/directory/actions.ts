/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

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

export async function getStaff() {
  try {
    const tenantId = await getTenantId();
    return await prisma.staff.findMany({
      where: { tenantId },
      orderBy: { firstName: 'asc' },
      include: {
        user: true,
      }
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function createStaff(data: {
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  employeeNumber: string;
  email: string;
  phone: string;
  type: string;
}) {
  try {
    const tenantId = await getTenantId();

    let user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          phoneNumber: data.phone || undefined,
          passwordHash: "TEMPORARY_HASH",
        }
      });
    }

    const staff = await prisma.staff.create({
      data: {
        tenantId: tenantId,
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        jobTitle: data.jobTitle,
        department: data.department as any,
        employeeNumber: data.employeeNumber,
        hireDate: new Date(),
        status: "ACTIVE",
      }
    });

    revalidatePath("/dashboard/human-resources/employees/directory");
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("Error creating staff:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStaff(id: string, data: {
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  employeeNumber: string;
  status: string;
}) {
  try {
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        jobTitle: data.jobTitle,
        department: data.department as any,
        employeeNumber: data.employeeNumber,
        status: data.status as any,
      }
    });
    revalidatePath("/dashboard/human-resources/employees/directory");
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("Error updating staff:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStaff(id: string) {
  try {
    await prisma.staff.delete({
      where: { id }
    });
    revalidatePath("/dashboard/human-resources/employees/directory");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return { success: false, error: error.message };
  }
}
