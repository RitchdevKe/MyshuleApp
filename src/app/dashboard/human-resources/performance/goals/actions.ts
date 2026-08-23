"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    throw new Error("No tenant found");
  }
  return tenant.id;
}

export async function getStaff() {
  try {
    const tenantId = await getTenantId();
    const staff = await prisma.staff.findMany({
      where: { tenantId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        department: true,
      },
      take: 50,
    });
    return staff.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      department: s.department,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function getGoals() {
  try {
    const tenantId = await getTenantId();
    const goals = await prisma.goal.findMany({
      where: { tenantId },
      include: {
        staff: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return goals.map(g => ({
      id: g.id,
      title: g.title,
      owner: `${g.staff.firstName} ${g.staff.lastName}`,
      staffId: g.staffId,
      progress: g.progress,
      status: g.status,
      dueDate: g.dueDate.toISOString().split('T')[0],
      type: "Individual", // default mock since not in DB
    }));
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

export async function createGoal(data: {
  title: string;
  staffId: string;
  status: string;
  progress: number;
  dueDate: string;
}) {
  const tenantId = await getTenantId();
  await prisma.goal.create({
    data: {
      tenantId,
      title: data.title,
      staffId: data.staffId,
      status: data.status,
      progress: data.progress,
      dueDate: new Date(data.dueDate),
    }
  });
  revalidatePath('/dashboard/human-resources/performance/goals');
}

export async function updateGoal(id: string, data: {
  title: string;
  staffId: string;
  status: string;
  progress: number;
  dueDate: string;
}) {
  await prisma.goal.update({
    where: { id },
    data: {
      title: data.title,
      staffId: data.staffId,
      status: data.status,
      progress: data.progress,
      dueDate: new Date(data.dueDate),
    }
  });
  revalidatePath('/dashboard/human-resources/performance/goals');
}

export async function deleteGoal(id: string) {
  await prisma.goal.delete({
    where: { id }
  });
  revalidatePath('/dashboard/human-resources/performance/goals');
}
