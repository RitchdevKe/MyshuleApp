"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";
const ALLOCATION_PATH = "/dashboard/academics/teaching/allocation";

// ── Fetch helpers ─────────────────────────────────────────────────────────────

export async function getAllocationPageData() {
  const activeYear = await prisma.academicYear.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, isActiveYear: true },
  });

  const academicYearId = activeYear?.id ?? "__none__";

  const [rawAllocations, staffList, subjectsList, streamsList, totalStaff] =
    await Promise.all([
      prisma.subjectAllocation.findMany({
        where: { tenantId: DEFAULT_TENANT_ID, academicYearId },
        include: {
          staff: true,
          subject: true,
          stream: { include: { class: true } },
        },
        orderBy: { staff: { firstName: "asc" } },
      }),
      prisma.staff.findMany({
        where: { tenantId: DEFAULT_TENANT_ID, status: "ACTIVE" },
        orderBy: { firstName: "asc" },
      }),
      prisma.subject.findMany({
        where: { tenantId: DEFAULT_TENANT_ID },
        orderBy: { name: "asc" },
      }),
      prisma.stream.findMany({
        where: { tenantId: DEFAULT_TENANT_ID },
        include: { class: true },
        orderBy: { class: { name: "asc" } },
      }),
      prisma.staff.count({
        where: { tenantId: DEFAULT_TENANT_ID, status: "ACTIVE" },
      }),
    ]);

  // Group allocations by staff+subject so each row shows one teacher-subject combo
  // with multiple streams as "classes"
  const groupMap = new Map<
    string,
    {
      id: string; // first allocation id (used for single-stream edits)
      allocationIds: string[];
      staffId: string;
      staffFirstName: string;
      staffLastName: string;
      subjectId: string;
      subjectName: string;
      streams: { allocationId: string; streamId: string; streamName: string; className: string }[];
    }
  >();

  for (const a of rawAllocations) {
    const key = `${a.staffId}::${a.subjectId}`;
    const streamLabel = `${a.stream.class.name} - ${a.stream.name}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        id: a.id,
        allocationIds: [a.id],
        staffId: a.staffId,
        staffFirstName: a.staff.firstName,
        staffLastName: a.staff.lastName,
        subjectId: a.subjectId,
        subjectName: a.subject.name,
        streams: [
          {
            allocationId: a.id,
            streamId: a.streamId,
            streamName: streamLabel,
            className: a.stream.class.name,
          },
        ],
      });
    } else {
      const g = groupMap.get(key)!;
      g.allocationIds.push(a.id);
      g.streams.push({
        allocationId: a.id,
        streamId: a.streamId,
        streamName: streamLabel,
        className: a.stream.class.name,
      });
    }
  }

  const allocations = Array.from(groupMap.values());

  // Compute stats
  // Unique staff who have at least one allocation
  const allocatedStaffIds = new Set(rawAllocations.map((a) => a.staffId));
  const staffWithAllocations = allocatedStaffIds.size;

  // Build per-staff lessons count (each allocation row = 1 stream-subject mapping)
  const staffLessonMap = new Map<string, number>();
  for (const a of rawAllocations) {
    staffLessonMap.set(a.staffId, (staffLessonMap.get(a.staffId) ?? 0) + 1);
  }

  // Status thresholds: <=4 underutilized, 5-12 optimal, >12 overloaded
  let optimalCount = 0;
  let overloadedCount = 0;
  let underutilizedCount = 0;
  for (const count of staffLessonMap.values()) {
    if (count > 12) overloadedCount++;
    else if (count < 5) underutilizedCount++;
    else optimalCount++;
  }

  const stats = {
    totalStaff,
    optimalCount,
    overloadedCount,
    totalAllocations: rawAllocations.length,
  };

  // Workload chart data (per staff)
  const workloadData = Array.from(staffLessonMap.entries()).map(
    ([staffId, load]) => {
      const staff = rawAllocations.find((a) => a.staffId === staffId)?.staff;
      const name = staff ? `${staff.firstName}` : "Unknown";
      const color = load > 12 ? "#fb7185" : load < 5 ? "#f59e0b" : "#10b981";
      return { name, load, color };
    }
  );

  return {
    allocations,
    staffList: staffList.map((s) => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
    })),
    subjectsList: subjectsList.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
    })),
    streamsList: streamsList.map((s) => ({
      id: s.id,
      name: s.name,
      className: s.class.name,
      label: `${s.class.name} - ${s.name}`,
    })),
    academicYearId,
    stats,
    workloadData,
  };
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createAllocation(data: {
  staffId: string;
  subjectId: string;
  streamIds: string[];
  academicYearId: string;
}) {
  try {
    // Create one SubjectAllocation per stream
    await prisma.$transaction(
      data.streamIds.map((streamId) =>
        prisma.subjectAllocation.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            academicYearId: data.academicYearId,
            staffId: data.staffId,
            subjectId: data.subjectId,
            streamId,
          },
        })
      )
    );
    revalidatePath(ALLOCATION_PATH);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create allocation:", error);
    return { success: false, error: error.message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
// Update = delete all old allocations for staff+subject, recreate with new streams

export async function updateAllocation(data: {
  oldAllocationIds: string[];
  staffId: string;
  subjectId: string;
  streamIds: string[];
  academicYearId: string;
}) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete old rows
      await tx.subjectAllocation.deleteMany({
        where: { id: { in: data.oldAllocationIds } },
      });
      // Recreate with new streams
      for (const streamId of data.streamIds) {
        await tx.subjectAllocation.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            academicYearId: data.academicYearId,
            staffId: data.staffId,
            subjectId: data.subjectId,
            streamId,
          },
        });
      }
    });
    revalidatePath(ALLOCATION_PATH);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update allocation:", error);
    return { success: false, error: error.message };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteAllocation(allocationIds: string[]) {
  try {
    await prisma.subjectAllocation.deleteMany({
      where: { id: { in: allocationIds } },
    });
    revalidatePath(ALLOCATION_PATH);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete allocation:", error);
    return { success: false, error: error.message };
  }
}
