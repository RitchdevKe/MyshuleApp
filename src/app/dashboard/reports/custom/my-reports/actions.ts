"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMyReports() {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant?.id;

  if (!tenantId) {
    return [];
  }

  const reports = await prisma.customReport.findMany({
    where: {
      tenantId,
      type: {
        not: "TEMPLATE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reports;
}

export async function deleteReport(reportId: string) {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant?.id;

  if (!tenantId) {
    throw new Error("Tenant not found");
  }

  await prisma.customReport.delete({
    where: {
      id: reportId,
      tenantId,
    },
  });

  revalidatePath("/dashboard/reports/custom/my-reports");
}
