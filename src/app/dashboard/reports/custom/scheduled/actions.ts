"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getScheduledReports(tenantId: string) {
  const reports = await prisma.customReport.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter in memory for reports that have a schedule config
  return reports.filter((r) => {
    const config = r.config as any;
    return config && (config.scheduled === true || config.schedule);
  });
}

export async function updateReportSchedule(
  reportId: string,
  tenantId: string,
  scheduleData: any
) {
  const report = await prisma.customReport.findFirst({
    where: { id: reportId, tenantId },
  });

  if (!report) throw new Error("Report not found");

  const currentConfig = (report.config as any) || {};

  await prisma.customReport.update({
    where: { id: reportId },
    data: {
      config: {
        ...currentConfig,
        scheduled: scheduleData.status !== "Paused",
        schedule: scheduleData,
      },
    },
  });

  revalidatePath("/dashboard/reports/custom/scheduled");
}

export async function pauseSchedule(reportId: string, tenantId: string, isPaused: boolean) {
  const report = await prisma.customReport.findFirst({
    where: { id: reportId, tenantId },
  });

  if (!report) throw new Error("Report not found");

  const currentConfig = (report.config as any) || {};
  const currentSchedule = currentConfig.schedule || {};

  await prisma.customReport.update({
    where: { id: reportId },
    data: {
      config: {
        ...currentConfig,
        scheduled: !isPaused,
        schedule: {
          ...currentSchedule,
          status: isPaused ? "Paused" : "Active",
        },
      },
    },
  });

  revalidatePath("/dashboard/reports/custom/scheduled");
}

export async function getAllCustomReports(tenantId: string) {
  return await prisma.customReport.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}
