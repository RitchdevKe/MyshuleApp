"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPendingApprovals() {
  return await prisma.purchaseRequest.findMany({
    where: {
      status: 'PENDING'
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function approveRequest(id: string, formData?: FormData) {
  await prisma.purchaseRequest.update({
    where: { id },
    data: { status: 'APPROVED' }
  });
  revalidatePath('/dashboard/operations/procurement/approvals');
}

export async function rejectRequest(id: string, formData?: FormData) {
  await prisma.purchaseRequest.update({
    where: { id },
    data: { status: 'REJECTED' }
  });
  revalidatePath('/dashboard/operations/procurement/approvals');
}

export async function getApprovalStats() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.purchaseRequest.count({ where: { status: 'PENDING' } }),
    prisma.purchaseRequest.count({ where: { status: 'APPROVED' } }),
    prisma.purchaseRequest.count({ where: { status: 'REJECTED' } })
  ]);

  return { pending, approved, rejected };
}
