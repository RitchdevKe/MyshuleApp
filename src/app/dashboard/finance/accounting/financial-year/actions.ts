"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addFinancialYear(tenantId: string, data: { name: string; startDate: string; endDate: string }) {
  const newYear = await prisma.financialYear.create({
    data: {
      tenantId,
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isClosed: false,
    },
  });
  
  revalidatePath("/dashboard/finance/accounting/financial-year");
  return { success: true, year: newYear };
}

export async function updateFinancialYear(id: string, tenantId: string, data: { name: string; startDate: string; endDate: string }) {
  const updated = await prisma.financialYear.update({
    where: { id, tenantId },
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });

  revalidatePath("/dashboard/finance/accounting/financial-year");
  return { success: true, year: updated };
}

export async function closeFinancialYear(id: string, tenantId: string) {
  const updated = await prisma.financialYear.update({
    where: { id, tenantId },
    data: {
      isClosed: true,
    },
  });
  
  revalidatePath("/dashboard/finance/accounting/financial-year");
  return { success: true, year: updated };
}

export async function openFinancialYear(id: string, tenantId: string) {
  const updated = await prisma.financialYear.update({
    where: { id, tenantId },
    data: {
      isClosed: false,
    },
  });
  
  revalidatePath("/dashboard/finance/accounting/financial-year");
  return { success: true, year: updated };
}
