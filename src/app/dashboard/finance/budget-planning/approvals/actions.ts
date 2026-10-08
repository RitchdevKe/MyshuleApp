"use server";

import prisma from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateApprovalStatus(id: string, status: ApprovalStatus) {
  try {
    await prisma.budgetApproval.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/finance/budget-planning/approvals");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
