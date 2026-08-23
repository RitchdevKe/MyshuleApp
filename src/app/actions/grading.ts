"use server";

import prisma from "@/lib/prisma";
import { ScaleType } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getGradingScales() {
  return await prisma.gradingScale.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      ranges: {
        orderBy: { minScore: 'desc' }
      }
    },
    orderBy: { name: 'asc' }
  });
}

export async function createGradingScale(data: { name: string; scaleType: ScaleType }) {
  const result = await prisma.gradingScale.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      scaleType: data.scaleType,
    }
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true, id: result.id };
}

export async function deleteGradingScale(id: string) {
  await prisma.gradingScale.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true };
}

export async function createGradingScaleRange(data: {
  gradingScaleId: string;
  gradeLabel: string;
  minScore: number;
  maxScore: number;
  defaultRemarks?: string;
}) {
  const result = await prisma.gradingScaleRange.create({
    data: {
      gradingScaleId: data.gradingScaleId,
      gradeLabel: data.gradeLabel,
      minScore: data.minScore,
      maxScore: data.maxScore,
      defaultRemarks: data.defaultRemarks,
    }
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true, id: result.id };
}

export async function deleteGradingScaleRange(id: string) {
  await prisma.gradingScaleRange.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true };
}
