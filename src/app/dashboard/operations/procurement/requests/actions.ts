"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createPurchaseRequest(data: {
  department: string;
  description: string;
  amount: number;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const requestNumber = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.purchaseRequest.create({
    data: {
      tenantId: session.tenantId,
      requestNumber,
      department: data.department,
      requestedBy: session.userId,
      description: data.description,
      amount: data.amount,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/operations/procurement/requests");
}
