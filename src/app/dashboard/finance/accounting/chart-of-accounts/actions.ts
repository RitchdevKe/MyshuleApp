"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export async function addChartOfAccount(data: {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  description?: string;
}) {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    await prisma.chartOfAccount.create({
      data: {
        tenantId: tenant.id,
        accountCode: data.accountCode,
        accountName: data.accountName,
        accountType: data.accountType,
        description: data.description,
      },
    });

    revalidatePath("/dashboard/finance/accounting/chart-of-accounts");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding chart of account:", error);
    return { success: false, error: error.message || "Failed to add account" };
  }
}
