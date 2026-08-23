"use server";

import prisma from "@/lib/prisma";
import { MessageChannel } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

// --- CHANNELS ---
export async function getCommunicationSettings() {
  let settings = await prisma.communicationSettings.findUnique({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  if (!settings) {
    settings = await prisma.communicationSettings.create({
      data: { tenantId: DEFAULT_TENANT_ID }
    });
  }
  return settings;
}

export async function updateCommunicationSettings(data: any) {
  await prisma.communicationSettings.update({
    where: { tenantId: DEFAULT_TENANT_ID },
    data
  });
  revalidatePath("/dashboard/settings/communication/channels");
  return { success: true };
}

// --- TEMPLATES ---
export async function getMessageTemplates() {
  return await prisma.messageTemplate.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { name: 'asc' }
  });
}

export async function createMessageTemplate(data: { name: string, channel: MessageChannel }) {
  const t = await prisma.messageTemplate.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      channel: data.channel,
      subject: data.channel === "EMAIL" ? "New Message" : null,
      body: "Hello {{studentName}}, this is a message from {{schoolName}}.",
    }
  });
  revalidatePath("/dashboard/settings/communication/templates");
  return { success: true, id: t.id };
}

export async function updateMessageTemplate(id: string, data: any) {
  await prisma.messageTemplate.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/settings/communication/templates");
  return { success: true };
}

// --- TRIGGERS ---
export async function getCommunicationTriggers() {
  return await prisma.communicationTrigger.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { template: true },
    orderBy: { event: 'asc' }
  });
}

export async function toggleCommunicationTrigger(id: string, isActive: boolean) {
  await prisma.communicationTrigger.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath("/dashboard/settings/communication/triggers");
  return { success: true };
}

export async function assignTemplateToTrigger(triggerId: string, templateId: string | null) {
  await prisma.communicationTrigger.update({
    where: { id: triggerId },
    data: { templateId }
  });
  revalidatePath("/dashboard/settings/communication/triggers");
  return { success: true };
}

export async function deleteMessageTemplate(id: string) {
  await prisma.messageTemplate.delete({ where: { id } });
  revalidatePath("/dashboard/settings/communication/templates");
  return { success: true };
}

export async function seedTriggersIfEmpty() {
  const count = await prisma.communicationTrigger.count({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  if (count === 0) {
    const events = [
      "INVOICE_GENERATED",
      "STUDENT_ABSENT",
      "EXAM_PUBLISHED",
      "NEW_ADMISSION",
      "PAYMENT_RECEIVED",
      "FEE_OVERDUE",
    ];
    const channels: MessageChannel[] = ["EMAIL", "SMS"];

    for (const e of events) {
      for (const c of channels) {
        await prisma.communicationTrigger.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            event: e,
            channel: c,
            isActive: false,
          }
        });
      }
    }
  }
}
