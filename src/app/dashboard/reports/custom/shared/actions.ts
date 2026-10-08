"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSharedReports() {
  try {
    const reports = await prisma.customReport.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Filter out reports that do not have shared: true in config
    const sharedReports = reports.filter((report) => {
      if (!report.config) return false;
      const config = report.config as any;
      return config.shared === true;
    });

    return { success: true, data: sharedReports };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function revokeShare(id: string) {
  try {
    const report = await prisma.customReport.findUnique({
      where: { id },
    });
    
    if (!report) {
      return { success: false, error: "Report not found" };
    }

    const config = (report.config as any) || {};
    config.shared = false;

    await prisma.customReport.update({
      where: { id },
      data: { config },
    });

    revalidatePath("/dashboard/reports/custom/shared");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
