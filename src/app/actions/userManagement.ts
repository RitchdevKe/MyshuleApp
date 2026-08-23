"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

// =====================================
// OVERVIEW
// =====================================
export async function getUserOverviewStats() {
  const users = await prisma.user.findMany({
    where: { tenantUsers: { some: { tenantId: DEFAULT_TENANT_ID } } },
    include: { tenantUsers: { include: { role: true } } }
  });

  const total = users.length;
  const active = users.filter(u => u.status === "ACTIVE").length;
  const suspended = users.filter(u => u.status === "SUSPENDED").length;

  const pendingRequests = await prisma.accessRequest.count({
    where: { tenantId: DEFAULT_TENANT_ID, status: "PENDING" }
  });

  return { total, active, suspended, pendingRequests, recentUsers: users.slice(0, 5) };
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    where: { tenantUsers: { some: { tenantId: DEFAULT_TENANT_ID } } },
    include: {
      tenantUsers: {
        include: {
          role: true,
          branch: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}


// =====================================
// USERS
// =====================================
export async function createUser(data: { name: string; email: string; roleId: string; branchId?: string }) {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: "dummy-hash",
      status: "ACTIVE",
      tenantUsers: {
        create: {
          tenantId: DEFAULT_TENANT_ID,
          roleId: data.roleId,
          ...(data.branchId ? { branchId: data.branchId } : {})
        }
      }
    }
  });
  
  await prisma.auditLog.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      userId: user.id,
      action: "User Created",
      entityName: "User"
    }
  });

  revalidatePath("/dashboard/registration/school-structure/users");
  revalidatePath("/dashboard/administration/users");
  return { success: true, user };
}

export async function changeUserRole(userId: string, newRoleId: string) {
  await prisma.tenantUser.update({
    where: { userId_tenantId: { userId, tenantId: DEFAULT_TENANT_ID } },
    data: { roleId: newRoleId }
  });
  
  await prisma.auditLog.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      userId: userId,
      action: "Role Changed",
      entityName: "User"
    }
  });

  revalidatePath("/dashboard/administration/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  // we delete the TenantUser link, or delete the User entirely. Let's just delete the TenantUser link for safety.
  await prisma.tenantUser.delete({
    where: { userId_tenantId: { userId, tenantId: DEFAULT_TENANT_ID } }
  });
  revalidatePath("/dashboard/registration/school-structure/users");
  revalidatePath("/dashboard/administration/users");
  return { success: true };
}

// =====================================
// GROUPS
// =====================================
export async function getGroups() {
  return await prisma.userGroup.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { _count: { select: { members: true } } },
    orderBy: { name: "asc" }
  });
}

export async function createGroup(data: { name: string; description: string }) {
  const group = await prisma.userGroup.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      description: data.description,
    }
  });
  revalidatePath("/dashboard/administration/users/groups");
  return { success: true, group };
}

export async function deleteGroup(groupId: string) {
  await prisma.userGroup.delete({
    where: { id: groupId }
  });
  revalidatePath("/dashboard/administration/users/groups");
  return { success: true };
}

// =====================================
// INVITATIONS
// =====================================
export async function getInvitations() {
  return await prisma.userInvitation.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { role: true },
    orderBy: { sentAt: "desc" }
  });
}

export async function createInvitation(data: { email: string; roleId: string }) {
  const invitation = await prisma.userInvitation.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      email: data.email,
      roleId: data.roleId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });
  
  revalidatePath("/dashboard/administration/users/invitations");
  return { success: true, invitation };
}

export async function revokeInvitation(invitationId: string) {
  await prisma.userInvitation.update({
    where: { id: invitationId },
    data: { status: "REVOKED" }
  });
  revalidatePath("/dashboard/administration/users/invitations");
  return { success: true };
}

export async function resendInvitation(invitationId: string) {
  await prisma.userInvitation.update({
    where: { id: invitationId },
    data: { sentAt: new Date(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
  });
  revalidatePath("/dashboard/administration/users/invitations");
  return { success: true };
}

// =====================================
// ACCESS REQUESTS
// =====================================
export async function getAccessRequests() {
  return await prisma.accessRequest.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { user: { include: { tenantUsers: { include: { role: true } } } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function approveRequest(requestId: string) {
  await prisma.accessRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED", resolvedAt: new Date() }
  });
  revalidatePath("/dashboard/administration/users/requests");
  return { success: true };
}

export async function rejectRequest(requestId: string) {
  await prisma.accessRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", resolvedAt: new Date() }
  });
  revalidatePath("/dashboard/administration/users/requests");
  return { success: true };
}

// =====================================
// ACTIVITY LOGS
// =====================================
export async function getActivityLogs() {
  return await prisma.auditLog.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}
