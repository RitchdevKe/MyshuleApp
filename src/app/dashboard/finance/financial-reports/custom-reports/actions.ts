"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomReportAction(data: {
  name: string;
  description: string;
  type: string;
  config: any;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const report = await prisma.customReport.create({
    data: {
      tenantId: tenant.id,
      name: data.name,
      description: data.description,
      type: data.type,
      config: data.config,
    },
  });

  revalidatePath("/dashboard/finance/financial-reports/custom-reports");
  return { success: true, report };
}
