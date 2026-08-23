"use server";

import { HardwareType, HardwareStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getHardwareDevices() {
  return await prisma.hardwareDevice.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createHardwareDevice(data: {
  name: string;
  type: HardwareType;
  ipAddress?: string;
  macAddress?: string;
  location?: string;
}) {
  const result = await prisma.hardwareDevice.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      ...data,
      status: "OFFLINE"
    }
  });

  revalidatePath("/dashboard/settings/integrations/hardware");
  return { success: true, id: result.id };
}

export async function deleteHardwareDevice(id: string) {
  await prisma.hardwareDevice.delete({
    where: { id }
  });
  revalidatePath("/dashboard/settings/integrations/hardware");
  return { success: true };
}
