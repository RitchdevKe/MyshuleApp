"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EngagementCampaign, EngagementEvent, EngagementSurvey } from "@prisma/client";

// EngagementCampaign
export async function getCampaigns(tenantId: string) {
  return await prisma.engagementCampaign.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCampaign(data: Omit<EngagementCampaign, "id" | "createdAt" | "updatedAt">) {
  const result = await prisma.engagementCampaign.create({ data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function updateCampaign(id: string, data: Partial<Omit<EngagementCampaign, "id" | "createdAt" | "updatedAt" | "tenantId">>) {
  const result = await prisma.engagementCampaign.update({ where: { id }, data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function deleteCampaign(id: string) {
  const result = await prisma.engagementCampaign.delete({ where: { id } });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

// EngagementEvent
export async function getEvents(tenantId: string) {
  return await prisma.engagementEvent.findMany({
    where: { tenantId },
    orderBy: { date: 'asc' },
  });
}

export async function createEvent(data: Omit<EngagementEvent, "id" | "createdAt" | "updatedAt">) {
  const result = await prisma.engagementEvent.create({ data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function updateEvent(id: string, data: Partial<Omit<EngagementEvent, "id" | "createdAt" | "updatedAt" | "tenantId">>) {
  const result = await prisma.engagementEvent.update({ where: { id }, data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function deleteEvent(id: string) {
  const result = await prisma.engagementEvent.delete({ where: { id } });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

// EngagementSurvey
export async function getSurveys(tenantId: string) {
  return await prisma.engagementSurvey.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createSurvey(data: Omit<EngagementSurvey, "id" | "createdAt" | "updatedAt">) {
  const result = await prisma.engagementSurvey.create({ data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function updateSurvey(id: string, data: Partial<Omit<EngagementSurvey, "id" | "createdAt" | "updatedAt" | "tenantId">>) {
  const result = await prisma.engagementSurvey.update({ where: { id }, data });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}

export async function deleteSurvey(id: string) {
  const result = await prisma.engagementSurvey.delete({ where: { id } });
  revalidatePath("/dashboard/communication/engagement");
  return result;
}
