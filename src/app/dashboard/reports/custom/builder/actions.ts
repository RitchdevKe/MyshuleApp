"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "138dbb08-0e57-412f-b813-cfa271cd418c";

async function getTenantId(): Promise<string> {
  try {
    const tenant = await prisma.tenant.findFirst({ select: { id: true } });
    return tenant?.id || DEFAULT_TENANT_ID;
  } catch {
    return DEFAULT_TENANT_ID;
  }
}

export async function saveCustomReport(data: { name: string; description: string; type: string; config: any }) {
  try {
    const tenantId = await getTenantId();

    const report = await prisma.customReport.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        type: data.type || "FINANCIAL",
        config: data.config,
      },
    });

    revalidatePath("/dashboard/reports/custom/my-reports");
    return { success: true, reportId: report.id };
  } catch (error: any) {
    console.error("Error saving custom report:", error);
    return { success: false, error: error.message };
  }
}
