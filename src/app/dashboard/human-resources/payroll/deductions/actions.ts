"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// We'll hardcode a tenantId for this demo or get it if there's an auth layer.
// Actually, let's just get the first tenant for demo purposes.
async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    throw new Error("No tenant found");
  }
  return tenant.id;
}

export async function getDeductions() {
  const tenantId = await getTenantId();
  return await prisma.deduction.findMany({
    where: { tenantId }
  });
}

export async function createDeduction(data: { name: string; type: string; amount?: number | null; percentage?: number | null }) {
  const tenantId = await getTenantId();
  const res = await prisma.deduction.create({
    data: {
      ...data,
      tenantId
    }
  });
  revalidatePath('/dashboard/human-resources/payroll/deductions');
  return res;
}

export async function updateDeduction(id: string, data: { name: string; type: string; amount?: number | null; percentage?: number | null }) {
  const res = await prisma.deduction.update({
    where: { id },
    data
  });
  revalidatePath('/dashboard/human-resources/payroll/deductions');
  return res;
}

export async function deleteDeduction(id: string) {
  const res = await prisma.deduction.delete({
    where: { id }
  });
  revalidatePath('/dashboard/human-resources/payroll/deductions');
  return res;
}
