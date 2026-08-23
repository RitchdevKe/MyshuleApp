"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getAcademicSettings() {
  let settings = await prisma.academicSettings.findUnique({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  if (!settings) {
    settings = await prisma.academicSettings.create({
      data: { tenantId: DEFAULT_TENANT_ID }
    });
  }

  return settings;
}

export async function updateAcademicSettings(data: {
  anonymousGrading?: boolean;
  strictInvigilation?: boolean;
  autoPublishResults?: boolean;
  lockGradesAfterPublish?: boolean;
  minPassMark?: number;
  distinctionMark?: number;
  requireDailyAttendance?: boolean;
  notifyParentsOnAbsence?: boolean;
  absenceWarningThreshold?: number;
  periodsPerDay?: number;
  periodDurationMinutes?: number;
  schoolStartTime?: string;
  schoolEndTime?: string;
  breakSlots?: any;
  enableRemedialClasses?: boolean;
  remedialBeforeSchool?: boolean;
  remedialAfterSchool?: boolean;
  remedialWeekends?: boolean;
  remedialHolidays?: boolean;
  remedialStartTime?: string;
  remedialEndTime?: string;
}) {
  await prisma.academicSettings.update({
    where: { tenantId: DEFAULT_TENANT_ID },
    data
  });

  revalidatePath("/dashboard/settings/academic/examinations");
  revalidatePath("/dashboard/settings/academic/attendance");
  revalidatePath("/dashboard/settings/academic/timetable");
  revalidatePath("/dashboard/settings/academic/remedial");
  return { success: true };
}
