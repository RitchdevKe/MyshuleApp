"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "138dbb08-0e57-412f-b813-cfa271cd418c";

export async function getPaymentGateways() {
  return await prisma.paymentGateway.findMany({
    where: { tenantId: DEFAULT_TENANT_ID }
  });
}

export async function togglePaymentGateway(providerName: string, isActive: boolean) {
  const existing = await prisma.paymentGateway.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, providerName }
  });

  if (existing) {
    await prisma.paymentGateway.update({
      where: { id: existing.id },
      data: { isActive }
    });
  } else {
    await prisma.paymentGateway.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        providerName,
        isActive
      }
    });
  }
  revalidatePath("/dashboard/administration/system/integrations");
  return { success: true };
}

export async function toggleCommunicationIntegration(provider: string, isActive: boolean) {
  // Mock action for toggling communication integration
  await new Promise(resolve => setTimeout(resolve, 500));
  revalidatePath("/dashboard/administration/system/integrations");
  return { success: true };
}

export async function toggleLMSIntegration(provider: string, isActive: boolean) {
  // Mock action for toggling LMS integration
  await new Promise(resolve => setTimeout(resolve, 500));
  revalidatePath("/dashboard/administration/system/integrations");
  return { success: true };
}
