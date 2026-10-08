"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/operations/catering/menu";

export async function getMenuItems() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const items = await prisma.cateringMenu.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ dayOfWeek: "asc" }, { mealType: "asc" }],
  });

  return items.map((i) => ({
    id: i.id,
    dayOfWeek: i.dayOfWeek,
    mealType: i.mealType,
    name: i.name,
    description: i.description,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  }));
}

export async function getMenuStats() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalItems: 0, activeMeals: 0, daysPlanned: 0 };

  const items = await prisma.cateringMenu.findMany({
    where: { tenantId: tenant.id },
    select: { status: true, dayOfWeek: true },
  });

  const uniqueDays = new Set(items.map(i => i.dayOfWeek));

  return {
    totalItems: items.length,
    activeMeals: items.filter(i => i.status === "ACTIVE").length,
    daysPlanned: uniqueDays.size,
  };
}

export async function createMenuItem(data: {
  dayOfWeek: string;
  mealType: string;
  name: string;
  description?: string;
  status?: string;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.cateringMenu.create({
    data: {
      tenantId: tenant.id,
      dayOfWeek: data.dayOfWeek,
      mealType: data.mealType,
      name: data.name,
      description: data.description || null,
      status: data.status || "ACTIVE",
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function updateMenuItem(id: string, data: {
  dayOfWeek?: string;
  mealType?: string;
  name?: string;
  description?: string;
  status?: string;
}) {
  await prisma.cateringMenu.update({
    where: { id },
    data: {
      ...(data.dayOfWeek && { dayOfWeek: data.dayOfWeek }),
      ...(data.mealType && { mealType: data.mealType }),
      ...(data.name && { name: data.name }),
      description: data.description || null,
      ...(data.status && { status: data.status }),
    },
  });
  revalidatePath(REVALIDATE_PATH);
}

export async function deleteMenuItem(id: string) {
  await prisma.cateringMenu.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
