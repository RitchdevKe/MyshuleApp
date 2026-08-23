"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to ensure we have a tenant
async function getDefaultTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    const newTenant = await prisma.tenant.create({
      data: {
        name: "Default Tenant",
        domainPrefix: "default",
      },
    });
    return newTenant.id;
  }
  return tenant.id;
}

export async function getStaff() {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
      },
      take: 100,
    });
    return staff.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      role: s.jobTitle,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

export async function getAppraisals() {
  try {
    const appraisals = await prisma.appraisal.findMany({
      include: {
        staff: true,
        reviewer: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return appraisals.map(a => {
      let rating = "Pending";
      if (a.score !== null) {
        if (a.score >= 4.5) rating = "Outstanding";
        else if (a.score >= 4.0) rating = "Exceeds Expectations";
        else if (a.score >= 3.0) rating = "Meets Expectations";
        else rating = "Needs Improvement";
      }

      return {
        id: a.id,
        employee: `${a.staff.firstName} ${a.staff.lastName}`,
        role: a.staff.jobTitle,
        staffId: a.staffId,
        reviewerId: a.reviewerId,
        reviewer: `${a.reviewer.firstName} ${a.reviewer.lastName}`,
        score: a.score,
        rating: rating,
        status: a.status as "Completed" | "Pending Review" | "In Progress",
        date: a.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    });
  } catch (error) {
    console.error("Error fetching appraisals:", error);
    return [];
  }
}

export async function createAppraisal(data: { staffId: string, reviewerId: string, status: string, score: number | null, type?: string }) {
  try {
    const tenantId = await getDefaultTenantId();
    await prisma.appraisal.create({
      data: {
        tenantId,
        staffId: data.staffId,
        reviewerId: data.reviewerId,
        status: data.status,
        score: data.score,
        type: data.type || "Mid-Year",
      },
    });
    revalidatePath("/dashboard/human-resources/performance/appraisals");
    return { success: true };
  } catch (error) {
    console.error("Error creating appraisal:", error);
    return { success: false, error: "Failed to create appraisal" };
  }
}

export async function updateAppraisal(id: string, data: { staffId: string, reviewerId: string, status: string, score: number | null, type?: string }) {
  try {
    await prisma.appraisal.update({
      where: { id },
      data: {
        staffId: data.staffId,
        reviewerId: data.reviewerId,
        status: data.status,
        score: data.score,
        type: data.type || "Mid-Year",
      },
    });
    revalidatePath("/dashboard/human-resources/performance/appraisals");
    return { success: true };
  } catch (error) {
    console.error("Error updating appraisal:", error);
    return { success: false, error: "Failed to update appraisal" };
  }
}

export async function deleteAppraisal(id: string) {
  try {
    await prisma.appraisal.delete({
      where: { id },
    });
    revalidatePath("/dashboard/human-resources/performance/appraisals");
    return { success: true };
  } catch (error) {
    console.error("Error deleting appraisal:", error);
    return { success: false, error: "Failed to delete appraisal" };
  }
}
