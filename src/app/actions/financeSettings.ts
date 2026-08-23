"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getFinanceSettings() {
  let settings = await prisma.financeSettings.findUnique({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  if (!settings) {
    settings = await prisma.financeSettings.create({
      data: {
        tenantId: DEFAULT_TENANT_ID
      }
    });
  }

  return settings;
}

export async function updateFinanceSettings(data: {
  invoicePrefix: string;
  receiptPrefix: string;
  allowPartialPayments: boolean;
  requireDiscountApproval: boolean;
  taxRate: number;
  defaultCurrency: string;
}) {
  await prisma.financeSettings.update({
    where: { tenantId: DEFAULT_TENANT_ID },
    data
  });
  
  revalidatePath("/dashboard/settings/finance/controls");
  return { success: true };
}
