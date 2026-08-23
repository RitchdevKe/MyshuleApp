"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getChartOfAccounts() {
  return await prisma.chartOfAccount.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: [
      { accountType: 'asc' },
      { accountCode: 'asc' }
    ]
  });
}

export async function createChartOfAccount(data: {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  description?: string;
}) {
  const result = await prisma.chartOfAccount.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountType: data.accountType,
      description: data.description,
      isActive: true,
    }
  });

  revalidatePath("/dashboard/settings/finance/chart-of-accounts");
  return { success: true, id: result.id };
}

export async function deleteChartOfAccount(id: string) {
  await prisma.chartOfAccount.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/finance/chart-of-accounts");
  return { success: true };
}
