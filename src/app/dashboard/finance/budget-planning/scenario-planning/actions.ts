"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveScenarioAction(budgetId: string, name: string, description: string, adjustedAmount: number) {
  const scenario = await prisma.budgetScenario.create({
    data: {
      budgetId,
      name,
      description,
      adjustedAmount,
    },
  });

  revalidatePath("/dashboard/finance/budget-planning/scenario-planning");
  return scenario;
}
