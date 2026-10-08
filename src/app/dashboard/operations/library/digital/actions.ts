"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "cm05uay5e0000a68d0e7x0e6h";

export async function getTenantId() {
  const tenant = await prisma.tenant.findFirst();
  return tenant?.id || DEFAULT_TENANT_ID;
}

export async function getDigitalResources() {
  const tenantId = await getTenantId();
  return await prisma.digitalResource.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDigitalResource(data: {
  title: string;
  author?: string;
  type: string;
  size?: string;
  status?: string;
  url?: string;
}) {
  const tenantId = await getTenantId();
  await prisma.digitalResource.create({
    data: {
      ...data,
      tenantId,
    },
  });
  revalidatePath("/dashboard/operations/library/digital");
}

export async function deleteDigitalResource(id: string) {
  const tenantId = await getTenantId();
  await prisma.digitalResource.deleteMany({
    where: { id, tenantId },
  });
  revalidatePath("/dashboard/operations/library/digital");
}

export async function downloadDigitalResource(id: string) {
  const tenantId = await getTenantId();
  await prisma.digitalResource.updateMany({
    where: { id, tenantId },
    data: {
      downloads: {
        increment: 1,
      },
    },
  });
  revalidatePath("/dashboard/operations/library/digital");
}
