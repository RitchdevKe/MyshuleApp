"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

async function getTenantId() {
  try {
    const tenant = await prisma.tenant.findFirst();
    return tenant ? tenant.id : DEFAULT_TENANT_ID;
  } catch (e) {
    return DEFAULT_TENANT_ID;
  }
}

export async function getJobOpenings() {
  try {
    const tenantId = await getTenantId();
    return await prisma.jobOpening.findMany({
      where: { tenantId },
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("Error fetching job openings:", error);
    return [];
  }
}

export async function getApplicants() {
  try {
    const tenantId = await getTenantId();
    return await prisma.applicant.findMany({
      where: { tenantId },
      include: {
        jobOpening: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
}

export async function createApplicant(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobOpeningId: string;
  status: string;
}) {
  try {
    const tenantId = await getTenantId();
    const applicant = await prisma.applicant.create({
      data: {
        tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`,
        phone: data.phone,
        jobOpeningId: data.jobOpeningId,
        status: data.status,
      },
    });
    revalidatePath("/dashboard/human-resources/recruitment/applicants");
    return { success: true, data: applicant };
  } catch (error: any) {
    console.error("Error creating applicant:", error);
    return { success: false, error: error.message };
  }
}

export async function updateApplicant(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    jobOpeningId?: string;
    status?: string;
  }
) {
  try {
    const applicant = await prisma.applicant.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/human-resources/recruitment/applicants");
    return { success: true, data: applicant };
  } catch (error: any) {
    console.error("Error updating applicant:", error);
    return { success: false, error: error.message };
  }
}

export async function updateApplicantStage(id: string, stage: string) {
  try {
    const applicant = await prisma.applicant.update({
      where: { id },
      data: { status: stage },
    });
    revalidatePath("/dashboard/human-resources/recruitment/applicants");
    return { success: true, data: applicant };
  } catch (error: any) {
    console.error("Error updating applicant stage:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteApplicant(id: string) {
  try {
    await prisma.applicant.delete({
      where: { id },
    });
    revalidatePath("/dashboard/human-resources/recruitment/applicants");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting applicant:", error);
    return { success: false, error: error.message };
  }
}

export async function ensureDefaultJobOpenings() {
  try {
    const tenantId = await getTenantId();
    const existing = await prisma.jobOpening.findMany({ where: { tenantId } });
    if (existing.length === 0) {
      await prisma.jobOpening.createMany({
        data: [
          { tenantId, title: "Senior Mathematics Teacher", type: "Full-Time", location: "On-site", status: "Active" },
          { tenantId, title: "School Nurse", type: "Full-Time", location: "On-site", status: "Active" },
          { tenantId, title: "Bus Driver", type: "Full-Time", location: "On-site", status: "Active" },
          { tenantId, title: "IT Support Technician", type: "Full-Time", location: "Hybrid", status: "Active" },
        ],
      });
      return await prisma.jobOpening.findMany({ where: { tenantId } });
    }
    return existing;
  } catch (e) {
    console.error("Failed to ensure default job openings", e);
    return [];
  }
}
