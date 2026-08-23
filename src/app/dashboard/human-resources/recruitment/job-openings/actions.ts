"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getJobOpenings() {
  try {
    let tenantId = DEFAULT_TENANT_ID;
    const tenant = await prisma.tenant.findFirst();
    if (tenant) tenantId = tenant.id;

    return await prisma.jobOpening.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        applicants: true
      }
    });
  } catch (error) {
    console.error("Error fetching job openings:", error);
    return [];
  }
}

export async function createJobOpening(data: {
  title: string;
  department: string;
  type: string;
  location: string;
  status: string;
}) {
  try {
    let tenantId = DEFAULT_TENANT_ID;
    const tenant = await prisma.tenant.findFirst();
    if (tenant) tenantId = tenant.id;

    const jobOpening = await prisma.jobOpening.create({
      data: {
        tenantId,
        title: data.title,
        department: data.department.toUpperCase() as any,
        type: data.type,
        location: data.location,
        status: data.status,
      }
    });

    revalidatePath("/dashboard/human-resources/recruitment/job-openings");
    return { success: true, data: jobOpening };
  } catch (error: any) {
    console.error("Error creating job opening:", error);
    return { success: false, error: error.message };
  }
}

export async function updateJobOpening(id: string, data: {
  title: string;
  department: string;
  type: string;
  location: string;
  status: string;
}) {
  try {
    const jobOpening = await prisma.jobOpening.update({
      where: { id },
      data: {
        title: data.title,
        department: data.department.toUpperCase() as any,
        type: data.type,
        location: data.location,
        status: data.status,
      }
    });
    revalidatePath("/dashboard/human-resources/recruitment/job-openings");
    return { success: true, data: jobOpening };
  } catch (error: any) {
    console.error("Error updating job opening:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteJobOpening(id: string) {
  try {
    await prisma.jobOpening.delete({
      where: { id }
    });
    revalidatePath("/dashboard/human-resources/recruitment/job-openings");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting job opening:", error);
    return { success: false, error: error.message };
  }
}
