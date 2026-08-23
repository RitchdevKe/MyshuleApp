"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBranches(tenantId: string) {
  try {
    const branches = await prisma.branch.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { classes: true, tenantUsers: true }
        }
      }
    });
    return { success: true, data: branches };
  } catch (error) {
    console.error("Error fetching branches:", error);
    return { success: false, error: "Failed to fetch branches" };
  }
}

export async function createBranch(data: {
  tenantId: string;
  name: string;
  address?: string;
  head?: string;
  capacity?: number;
  status?: string;
  founded?: string;
  levelTypes?: string[];
}) {
  try {
    const branch = await prisma.branch.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        address: data.address || null,
        head: data.head || null,
        capacity: data.capacity ? Number(data.capacity) : null,
        status: data.status || "Active",
        founded: data.founded || null,
        levelTypes: data.levelTypes as any || [],
      }
    });
    revalidatePath("/dashboard/registration/school-structure/branches");
    return { success: true, data: branch };
  } catch (error) {
    console.error("Error creating branch:", error);
    return { success: false, error: "Failed to create branch" };
  }
}

export async function updateBranch(id: string, data: {
  name: string;
  address?: string;
  head?: string;
  capacity?: number;
  status?: string;
  founded?: string;
  levelTypes?: string[];
}) {
  try {
    const branch = await prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address || null,
        head: data.head || null,
        capacity: data.capacity ? Number(data.capacity) : null,
        status: data.status || "Active",
        founded: data.founded || null,
        levelTypes: data.levelTypes as any || undefined,
      }
    });
    revalidatePath("/dashboard/registration/school-structure/branches");
    return { success: true, data: branch };
  } catch (error) {
    console.error("Error updating branch:", error);
    return { success: false, error: "Failed to update branch" };
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({
      where: { id }
    });
    revalidatePath("/dashboard/registration/school-structure/branches");
    return { success: true };
  } catch (error) {
    console.error("Error deleting branch:", error);
    return { success: false, error: "Failed to delete branch" };
  }
}
