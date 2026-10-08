"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getStaff() {
  return await prisma.staff.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      user: {
        include: {
          tenantUsers: {
            where: { tenantId: DEFAULT_TENANT_ID },
            include: { role: true }
          }
        }
      }
    },
    orderBy: { firstName: 'asc' }
  });
}

export async function getRoles() {
  let roles = await prisma.role.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { name: 'asc' }
  });

  if (roles.length === 0) {
    const defaults = ["School Owner", "Principal", "Bursar", "Teacher", "Deputy Bursar", "Transport Coordinator"];
    await prisma.role.createMany({
      data: defaults.map(name => ({
        tenantId: DEFAULT_TENANT_ID,
        name
      }))
    });
    roles = await prisma.role.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { name: 'asc' }
    });
  }

  return roles;
}

export async function createStaff(data: {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: any;
  employeeNumber: string;
  roleId: string;
}) {
  // 1. Create User
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: "TEMPORARY_HASH", // In reality, generate random or send invite
    }
  });

  // 2. Create TenantUser to assign Role
  await prisma.tenantUser.create({
    data: {
      userId: user.id,
      tenantId: DEFAULT_TENANT_ID,
      roleId: data.roleId,
    }
  });

  // 3. Create Staff profile
  const result = await prisma.staff.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      userId: user.id,
      employeeNumber: data.employeeNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle,
      department: data.department,
      hireDate: new Date(),
    }
  });

  revalidatePath("/dashboard/administration/users");
  return { success: true, id: result.id };
}

export async function suspendStaff(id: string) {
  await prisma.staff.update({
    where: { id },
    data: { status: "ON_LEAVE" }
  });
  revalidatePath("/dashboard/administration/users");
  return { success: true };
}

export async function createRole(name: string) {
  const role = await prisma.role.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name
    }
  });
  revalidatePath("/dashboard/administration/roles/roles");
  return { success: true, role };
}

export async function deleteRole(id: string) {
  await prisma.role.delete({
    where: { id }
  });
  revalidatePath("/dashboard/administration/roles/roles");
  return { success: true };
}

export async function updateRole(id: string, name: string) {
  await prisma.role.update({
    where: { id },
    data: { name }
  });
  revalidatePath("/dashboard/administration/roles/roles");
  return { success: true };
}

export async function updateStaff(id: string, data: {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: any;
  employeeNumber?: string;
}) {
  await prisma.staff.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/administration/users");
  return { success: true };
}
