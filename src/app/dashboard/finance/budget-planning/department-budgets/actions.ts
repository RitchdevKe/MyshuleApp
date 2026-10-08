"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function allocateFunds(formData: FormData) {
  const budgetId = formData.get("budgetId") as string;
  const departmentName = formData.get("departmentName") as string;
  const amountStr = formData.get("amount") as string;
  const amount = parseFloat(amountStr || "0");

  if (!budgetId || !departmentName || isNaN(amount) || amount <= 0) {
    throw new Error("Invalid input");
  }

  const existing = await prisma.departmentBudget.findFirst({
    where: {
      budgetId,
      departmentName,
    },
  });

  if (existing) {
    await prisma.departmentBudget.update({
      where: { id: existing.id },
      data: {
        allocatedAmount: existing.allocatedAmount + amount,
      },
    });
  } else {
    await prisma.departmentBudget.create({
      data: {
        budgetId,
        departmentName,
        allocatedAmount: amount,
        spentAmount: 0,
      },
    });
  }

  revalidatePath("/dashboard/finance/budget-planning/department-budgets");
}
