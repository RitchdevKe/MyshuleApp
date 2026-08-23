"use server";

import prisma from "@/lib/prisma";
import { CommunicationChannel, CommunicationStatus, MessageChannel } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getCommunicationLogs() {
  return await prisma.communicationLog.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { sentAt: "desc" },
    include: {
      recipientUser: {
        select: {
          email: true,
          phoneNumber: true,
          parents: { select: { firstName: true, lastName: true } },
          students: { select: { firstName: true, lastName: true } },
          staff: { select: { firstName: true, lastName: true } }
        },
      },
    },
  });
}

export async function getMessageTemplates() {
  return await prisma.messageTemplate.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createMessageTemplate(data: { name: string, channel: MessageChannel, subject?: string, body: string, isActive?: boolean }) {
  const t = await prisma.messageTemplate.create({
    data: {
      ...data,
      tenantId: DEFAULT_TENANT_ID,
    },
  });
  revalidatePath("/dashboard/registration/parents/communication");
  return t;
}

export async function updateMessageTemplate(id: string, data: { name: string, channel: MessageChannel, subject?: string, body: string, isActive?: boolean }) {
  const t = await prisma.messageTemplate.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/registration/parents/communication");
  return t;
}

export async function deleteMessageTemplate(id: string) {
  await prisma.messageTemplate.delete({
    where: { id },
  });
  revalidatePath("/dashboard/registration/parents/communication");
}

export async function getRecipients() {
  const parents = await prisma.parent.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      user: {
        select: {
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  const admissions = await prisma.admissionApplication.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
  });

  return {
    parents: parents.map(p => ({
      id: p.id,
      userId: p.userId,
      name: `${p.firstName} ${p.lastName}`,
      phone: p.phonePrimary,
      email: p.user?.email || null,
      type: "Parent",
    })),
    admissions: admissions.map(a => ({
      id: a.id,
      userId: null,
      name: a.parentName,
      phone: a.parentPhone,
      email: a.parentEmail || null,
      type: "Admission",
    })),
  };
}

export async function sendCommunication(data: { recipientUserId?: string, contactAddress: string, channel: CommunicationChannel, subject?: string, body: string }) {
  // In a real app, this is where we'd trigger SMS/Email API.
  // For now, we mock the sending and just log it.
  
  const log = await prisma.communicationLog.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      recipientUserId: data.recipientUserId || null,
      contactAddress: data.contactAddress,
      channel: data.channel,
      subject: data.subject,
      body: data.body,
      status: CommunicationStatus.DELIVERED,
      sentAt: new Date(),
    },
  });
  
  revalidatePath("/dashboard/registration/parents/communication");
  return log;
}
