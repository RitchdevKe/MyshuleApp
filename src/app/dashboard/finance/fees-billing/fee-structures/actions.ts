"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

async function getTenantId() {
  try {
    const tenant = await prisma.tenant.findFirst();
    return tenant ? tenant.id : DEFAULT_TENANT_ID;
  } catch (error) {
    return DEFAULT_TENANT_ID;
  }
}

export async function getFeeStructures() {
  try {
    const tenantId = await getTenantId();
    return await prisma.feeStructure.findMany({
      where: { tenantId },
      include: {
        academicYear: true,
        class: true,
        items: true,
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    return [];
  }
}

export async function getAcademicYears() {
  try {
    const tenantId = await getTenantId();
    return await prisma.academicYear.findMany({
      where: { tenantId },
      orderBy: { startDate: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return [];
  }
}

export async function getClasses() {
  try {
    const tenantId = await getTenantId();
    return await prisma.class.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
}

export async function createFeeStructure(data: {
  name: string;
  academicYearId: string;
  classId: string;
  items: { name: string; amount: number }[];
}) {
  try {
    const tenantId = await getTenantId();
    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

    const feeStructure = await prisma.feeStructure.create({
      data: {
        tenantId,
        name: data.name,
        academicYearId: data.academicYearId,
        classId: data.classId,
        totalAmount,
        items: {
          create: data.items.map(item => ({
            name: item.name,
            amount: item.amount
          })),
        }
      }
    });

    revalidatePath("/dashboard/finance/fees-billing/fee-structures");
    return { success: true, data: feeStructure };
  } catch (error: any) {
    console.error("Error creating fee structure:", error);
    return { success: false, error: error.message };
  }
}
