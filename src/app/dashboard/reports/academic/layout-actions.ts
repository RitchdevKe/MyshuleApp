"use server";

import prisma from "@/lib/prisma";

export async function getAcademicFilterOptions() {
  const [years, terms, classes] = await Promise.all([
    prisma.academicYear.findMany({
      orderBy: { startDate: "desc" },
      select: { id: true, name: true, isActiveYear: true },
    }),
    prisma.academicTerm.findMany({
      orderBy: { startDate: "desc" },
      select: { id: true, name: true, isActiveTerm: true, academicYearId: true },
    }),
    prisma.class.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return { years, terms, classes };
}
