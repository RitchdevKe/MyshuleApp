"use server";

import prisma from "@/lib/prisma";
import { Department } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSalaryStructure(data: {
  name: string;
  baseRangeMin: number;
  baseRangeMax: number;
  grade: string;
}) {
  // Get default tenant
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.salaryStructure.create({
    data: {
      tenantId: tenant.id,
      name: data.name,
      baseRangeMin: data.baseRangeMin,
      baseRangeMax: data.baseRangeMax,
      grade: data.grade,
    },
  });

  revalidatePath("/dashboard/human-resources/payroll/salary-structures");
}

export async function updateSalaryStructure(
  id: string,
  data: {
    name: string;
    baseRangeMin: number;
    baseRangeMax: number;
    grade: string;
  }
) {
  await prisma.salaryStructure.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/human-resources/payroll/salary-structures");
}

export async function deleteSalaryStructure(id: string) {
  await prisma.salaryStructure.delete({
    where: { id },
  });

  revalidatePath("/dashboard/human-resources/payroll/salary-structures");
}
