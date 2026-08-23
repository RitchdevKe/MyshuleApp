"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mock function to get tenant ID. Assuming multi-tenant setup.
// Replace with your actual auth/tenant resolution.
const getTenantId = () => "tenant-123";

export async function getDisciplinaryActions() {
  try {
    const actions = await prisma.disciplinaryAction.findMany({
      include: {
        staff: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return { success: true, data: actions };
  } catch (error: any) {
    console.error("Error fetching disciplinary actions:", error);
    return { success: false, error: error.message };
  }
}

export async function createDisciplinaryAction(data: { staffId: string; offense: string; action: string; status: string; date?: string }) {
  try {
    // Note: getTenantId() would normally be fetched from the current session
    // For now we try to get a real tenant, or use a default one, or we can just pick the first tenant if it exists
    const tenant = await prisma.tenant.findFirst();
    const tenantId = tenant ? tenant.id : "tenant-1";

    const newAction = await prisma.disciplinaryAction.create({
      data: {
        tenantId,
        staffId: data.staffId,
        offense: data.offense,
        action: data.action,
        status: data.status,
        date: data.date ? new Date(data.date) : new Date(),
      }
    });
    revalidatePath('/dashboard/human-resources/welfare/disciplinary');
    return { success: true, data: newAction };
  } catch (error: any) {
    console.error("Error creating disciplinary action:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDisciplinaryAction(id: string, data: { offense?: string; action?: string; status?: string }) {
  try {
    const updatedAction = await prisma.disciplinaryAction.update({
      where: { id },
      data
    });
    revalidatePath('/dashboard/human-resources/welfare/disciplinary');
    return { success: true, data: updatedAction };
  } catch (error: any) {
    console.error("Error updating disciplinary action:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDisciplinaryAction(id: string) {
  try {
    await prisma.disciplinaryAction.delete({
      where: { id }
    });
    revalidatePath('/dashboard/human-resources/welfare/disciplinary');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting disciplinary action:", error);
    return { success: false, error: error.message };
  }
}

export async function getStaffMembers() {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeNumber: true,
      }
    });
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return { success: false, error: error.message };
  }
}
