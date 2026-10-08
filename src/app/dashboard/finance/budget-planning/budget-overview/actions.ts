"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBudget(data: FormData) {
  // We'll hardcode tenantId and financialYearId for the sake of this prototype/fix
  // In a real app, these would come from the user's session and the selected financial year
  
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  let financialYear = await prisma.financialYear.findFirst({
    where: { tenantId: tenant.id }
  });

  if (!financialYear) {
    financialYear = await prisma.financialYear.create({
      data: {
        tenantId: tenant.id,
        name: "FY 2026/2027",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
      }
    });
  }

  const name = data.get("name") as string || "New Budget";
  const totalAmount = parseFloat((data.get("totalAmount") as string) || "0");
  
  await prisma.budget.create({
    data: {
      tenantId: tenant.id,
      financialYearId: financialYear.id,
      name,
      totalAmount,
      spentAmount: 0,
      status: "DRAFT",
    }
  });

  revalidatePath("/dashboard/finance/budget-planning/budget-overview");
}
