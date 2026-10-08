"use server";
import prisma from "@/lib/prisma";

export async function getFinancialFilterOptions() {
  const [years, terms] = await Promise.all([
    prisma.academicYear.findMany({
      orderBy: { startDate: "desc" },
      select: { id: true, name: true, isActiveYear: true },
    }),
    prisma.academicTerm.findMany({
      orderBy: { startDate: "desc" },
      select: { id: true, name: true, isActiveTerm: true, academicYearId: true },
    })
  ]);

  return { years, terms };
}
