"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSports() {
  try {
    const sports = await prisma.extracurricularActivity.findMany({
      where: { activityType: "SPORT" },
      include: {
        patron: true,
        memberships: true,
      },
      orderBy: { name: "asc" },
    });
    return sports;
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
}

export async function getStaff() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { firstName: "asc" },
      take: 100, // Reasonable limit
    });
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function createSport(data: { name: string; patronId: string; tenantId?: string }) {
  try {
    let tenantId = data.tenantId;
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) throw new Error("No tenant found");
      tenantId = tenant.id;
    }

    const sport = await prisma.extracurricularActivity.create({
      data: {
        name: data.name,
        activityType: "SPORT",
        patronId: data.patronId || null,
        tenantId: tenantId,
      },
    });
    revalidatePath("/dashboard/student-life/activities/sports");
    return { success: true, data: sport };
  } catch (error: any) {
    console.error("Error creating sport:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSport(id: string, data: { name: string; patronId: string }) {
  try {
    const sport = await prisma.extracurricularActivity.update({
      where: { id },
      data: {
        name: data.name,
        patronId: data.patronId || null,
      },
    });
    revalidatePath("/dashboard/student-life/activities/sports");
    return { success: true, data: sport };
  } catch (error: any) {
    console.error("Error updating sport:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSport(id: string) {
  try {
    await prisma.extracurricularActivity.delete({
      where: { id },
    });
    revalidatePath("/dashboard/student-life/activities/sports");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting sport:", error);
    return { success: false, error: error.message };
  }
}
