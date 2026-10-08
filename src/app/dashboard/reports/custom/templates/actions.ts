"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return prisma.customReport.findMany({
    where: {
      tenantId: session.tenantId,
      type: "TEMPLATE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createReportFromTemplate(templateId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const template = await prisma.customReport.findUnique({
    where: { id: templateId, tenantId: session.tenantId },
  });

  if (!template) {
    throw new Error("Template not found");
  }

  const newReport = await prisma.customReport.create({
    data: {
      tenantId: session.tenantId,
      name: `Copy of ${template.name}`,
      description: template.description,
      type: "FINANCIAL",
      config: template.config || {},
      createdBy: session.userId,
    },
  });

  revalidatePath("/dashboard/reports/custom");
  return { success: true, reportId: newReport.id };
}
