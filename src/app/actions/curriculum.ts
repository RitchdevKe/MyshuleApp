"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getCurriculumOverview() {
  const [totalSubjects, allocations, exams, recentExams, activeTerms] = await Promise.all([
    prisma.subject.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
    prisma.subjectAllocation.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      distinct: ['subjectId'],
      select: { subjectId: true }
    }),
    prisma.exam.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
    prisma.exam.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { startDate: 'desc' },
      take: 5,
      include: { academicTerm: true }
    }),
    prisma.academicTerm.findMany({
      where: { tenantId: DEFAULT_TENANT_ID, isActiveTerm: true }
    })
  ]);

  const coverage = totalSubjects > 0 ? Math.round((allocations.length / totalSubjects) * 100) : 0;

  const topSubjects = await prisma.subject.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      _count: { select: { allocations: true } }
    },
    orderBy: {
      allocations: { _count: 'desc' }
    },
    take: 4
  });

  return {
    totalSubjects,
    coverage,
    totalExams: exams,
    recentExams,
    topSubjects,
    activeTerm: activeTerms.length > 0 ? activeTerms[0] : null
  };
}

export async function getExams() {
  return await prisma.exam.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { academicTerm: true },
    orderBy: { startDate: 'asc' }
  });
}

export async function getAcademicTerms() {
  return await prisma.academicTerm.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { startDate: 'asc' }
  });
}

export async function createExam(data: { name: string; academicTermId: string; startDate: Date; endDate: Date }) {
  const result = await prisma.exam.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      academicTermId: data.academicTermId,
      startDate: data.startDate,
      endDate: data.endDate
    }
  });
  revalidatePath("/dashboard/academics/curriculum/setup");
  revalidatePath("/dashboard/academics/curriculum");
  return { success: true, id: result.id };
}

export async function deleteExam(id: string) {
  await prisma.exam.delete({
    where: { id }
  });
  revalidatePath("/dashboard/academics/curriculum/setup");
  revalidatePath("/dashboard/academics/curriculum");
  return { success: true };
}
