"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/communication/reports";

// ---- Analytics ----

export async function getAnalytics() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return { totalSent: 0, deliveredSMS: 0, totalSMS: 0 };

  const logs = await prisma.communicationLog.findMany({
    where: { tenantId: tenant.id },
  });

  const totalSent = logs.length;
  const totalSMS = logs.filter(l => l.channel === 'SMS').length;
  const deliveredSMS = logs.filter(l => l.channel === 'SMS' && l.status === 'DELIVERED').length;

  return { totalSent, totalSMS, deliveredSMS };
}

// ---- Message Templates ----

export async function getMessageTemplates() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  return await prisma.messageTemplate.findMany({
    where: { tenantId: tenant.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createMessageTemplate(data: { name: string, channel: 'EMAIL' | 'SMS' | 'BOTH', subject?: string, body: string }) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const template = await prisma.messageTemplate.create({
    data: {
      tenantId: tenant.id,
      ...data
    }
  });
  revalidatePath(REVALIDATE_PATH);
  return template;
}

export async function updateMessageTemplate(id: string, data: { name?: string, channel?: 'EMAIL' | 'SMS' | 'BOTH', subject?: string, body?: string, isActive?: boolean }) {
  const template = await prisma.messageTemplate.update({
    where: { id },
    data,
  });
  revalidatePath(REVALIDATE_PATH);
  return template;
}

export async function deleteMessageTemplate(id: string) {
  await prisma.messageTemplate.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}

// ---- Communication Triggers ----

export async function getCommunicationTriggers() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  return await prisma.communicationTrigger.findMany({
    where: { tenantId: tenant.id },
    include: { template: true },
    orderBy: { event: "asc" },
  });
}

export async function createCommunicationTrigger(data: { event: string, channel: 'EMAIL' | 'SMS' | 'BOTH', templateId?: string }) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const trigger = await prisma.communicationTrigger.create({
    data: {
      tenantId: tenant.id,
      ...data
    }
  });
  revalidatePath(REVALIDATE_PATH);
  return trigger;
}

export async function updateCommunicationTrigger(id: string, data: { event?: string, channel?: 'EMAIL' | 'SMS' | 'BOTH', isActive?: boolean, templateId?: string }) {
  const trigger = await prisma.communicationTrigger.update({
    where: { id },
    data,
  });
  revalidatePath(REVALIDATE_PATH);
  return trigger;
}

export async function deleteCommunicationTrigger(id: string) {
  await prisma.communicationTrigger.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
