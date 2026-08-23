"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

/**
 * Fetches real data from the DB for the lesson-planning dashboard top cards.
 * Since there is no LessonPlan model yet, lesson plan counts are not DB-backed.
 * But staff counts, subject allocations, subjects, and classes are real.
 */
export async function getLessonPlanningOverview() {
  const [
    teachingStaffCount,
    allocations,
    subjects,
    classes,
  ] = await Promise.all([
    // Count active teaching staff
    prisma.staff.count({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        status: "ACTIVE",
        department: "ACADEMICS",
      },
    }),
    // Get all subject allocations with their staff, subject, stream -> class
    prisma.subjectAllocation.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        staff: { select: { id: true, firstName: true, lastName: true } },
        subject: { select: { id: true, name: true, code: true } },
        stream: {
          select: {
            id: true,
            name: true,
            class: { select: { id: true, name: true } },
          },
        },
      },
    }),
    // Get all subjects for the filter dropdown
    prisma.subject.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { name: "asc" },
      select: { id: true, name: true, code: true },
    }),
    // Get all classes for the filter dropdown
    prisma.class.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  // Derive unique teachers from allocations
  const uniqueTeachers = new Map<string, { id: string; firstName: string; lastName: string }>();
  for (const alloc of allocations) {
    if (!uniqueTeachers.has(alloc.staff.id)) {
      uniqueTeachers.set(alloc.staff.id, alloc.staff);
    }
  }

  return {
    teachingStaffCount,
    allocatedTeachersCount: uniqueTeachers.size,
    totalAllocations: allocations.length,
    subjects,
    classes,
    // Provide flat teacher list for the lesson plan form
    teachers: Array.from(uniqueTeachers.values()).map((t) => ({
      id: t.id,
      name: `${t.firstName} ${t.lastName}`,
    })),
  };
}
