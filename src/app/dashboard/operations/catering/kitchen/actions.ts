"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/catering/kitchen";

export async function getKitchenTasks() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const tasks = await prisma.kitchenTask.findMany({
    where: { tenantId: tenant.id },
    orderBy: { dueDate: "asc" },
  });

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    assignedTo: t.assignedTo,
    dueDate: t.dueDate.toISOString(),
    status: t.status,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function getKitchenStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalTasks: 0, pending: 0, inProgress: 0, completed: 0 };

  const tasks = await prisma.kitchenTask.findMany({
    where: { tenantId: tenant.id },
    select: { status: true },
  });

  return {
    totalTasks: tasks.length,
    pending: tasks.filter(t => t.status === "PENDING").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    completed: tasks.filter(t => t.status === "COMPLETED").length,
  };
}

export async function createKitchenTask(data: {
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate: string;
  status?: string;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.kitchenTask.create({
    data: {
      tenantId: tenant.id,
      title: data.title,
      description: data.description || null,
      assignedTo: data.assignedTo || null,
      dueDate: new Date(data.dueDate),
      status: data.status || "PENDING",
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateKitchenTask(id: string, data: {
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  status?: string;
}) {
  await prisma.kitchenTask.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      description: data.description || null,
      assignedTo: data.assignedTo || null,
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      ...(data.status && { status: data.status }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteKitchenTask(id: string) {
  await prisma.kitchenTask.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
