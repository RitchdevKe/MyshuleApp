"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Replace with a real mechanism to get tenantId if available, or just hardcode for demo purposes
// In this case, we'll try to find a tenant or use a default one.
async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");
  return tenant.id;
}

export async function createInterview(data: {
  applicantId: string;
  staffId: string;
  scheduledDate: Date;
  status: string;
}) {
  const tenantId = await getTenantId();
  const interview = await prisma.interview.create({
    data: {
      ...data,
      tenantId,
    },
  });
  revalidatePath("/dashboard/human-resources/recruitment/interviews");
  return interview;
}

export async function updateInterview(
  id: string,
  data: {
    applicantId?: string;
    staffId?: string;
    scheduledDate?: Date;
    status?: string;
  }
) {
  const interview = await prisma.interview.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/human-resources/recruitment/interviews");
  return interview;
}

export async function deleteInterview(id: string) {
  await prisma.interview.delete({
    where: { id },
  });
  revalidatePath("/dashboard/human-resources/recruitment/interviews");
}
