"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// TODO: Replace with real tenant ID from auth context
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2"; 

export async function getAcademicYears() {
  return await prisma.academicYear.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { startDate: "desc" },
    include: {
      terms: {
        orderBy: { startDate: "asc" }
      }
    }
  });
}

export async function createAcademicYear(data: { name: string; startDate: Date; endDate: Date }) {
  const result = await prisma.academicYear.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true, id: result.id };
}

export async function createAcademicTerm(data: { academicYearId: string; name: string; startDate: Date; endDate: Date }) {
  const result = await prisma.academicTerm.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      academicYearId: data.academicYearId,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true, id: result.id };
}

export async function setActiveAcademicYear(id: string) {
  // First set all years to false
  await prisma.academicYear.updateMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    data: { isActiveYear: false }
  });
  
  // Set the target to true
  await prisma.academicYear.update({
    where: { id },
    data: { isActiveYear: true }
  });
  
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}

export async function setActiveAcademicTerm(id: string) {
  // First set all terms to false
  await prisma.academicTerm.updateMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    data: { isActiveTerm: false }
  });
  
  // Set the target to true
  await prisma.academicTerm.update({
    where: { id },
    data: { isActiveTerm: true }
  });
  
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}

export async function updateAcademicYear(id: string, data: { name: string; startDate: Date; endDate: Date }) {
  await prisma.academicYear.update({
    where: { id },
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}

export async function deleteAcademicYear(id: string) {
  await prisma.academicYear.delete({ where: { id } });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}

export async function updateAcademicTerm(id: string, data: { name: string; startDate: Date; endDate: Date }) {
  await prisma.academicTerm.update({
    where: { id },
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}

export async function deleteAcademicTerm(id: string) {
  await prisma.academicTerm.delete({ where: { id } });
  revalidatePath("/dashboard/settings/academic/calendar");
  revalidatePath("/dashboard/registration/school-structure/academic");
  return { success: true };
}
export async function getSubjects() {
  return await prisma.subject.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { name: "asc" }
  });
}

export async function createSubject(data: { name: string; code: string; isCoreSubject: boolean }) {
  const result = await prisma.subject.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      ...data
    }
  });
  revalidatePath("/dashboard/settings/academic/subjects");
  return { success: true, id: result.id };
}

export async function deleteSubject(id: string) {
  await prisma.subject.delete({ where: { id } });
  revalidatePath("/dashboard/settings/academic/subjects");
  return { success: true };
}

export async function getGradingScales() {
  return await prisma.gradingScale.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      ranges: {
        orderBy: { minScore: "desc" }
      }
    }
  });
}

export async function createGradingScale(data: { name: string; scaleType: any }) {
  const result = await prisma.gradingScale.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      ...data
    }
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true, id: result.id };
}

export async function createGradingScaleRange(data: { gradingScaleId: string; gradeLabel: string; minScore: number; maxScore: number; defaultRemarks?: string }) {
  const result = await prisma.gradingScaleRange.create({
    data
  });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true, id: result.id };
}

export async function deleteGradingScale(id: string) {
  await prisma.gradingScale.delete({ where: { id } });
  revalidatePath("/dashboard/settings/academic/grading");
  return { success: true };
}

export async function getCurriculumLayoutStats() {
  try {
    const totalSubjects = await prisma.subject.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    
    // Stubbing syllabus coverage, lesson plans, etc since these models might not exist yet
    // Or we could count Classes, Streams, etc.
    const totalClasses = await prisma.class.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });

    const activeTerms = await prisma.academicTerm.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });

    return {
      totalSubjects,
      totalClasses,
      activeTerms,
    };
  } catch (error) {
    return {
      totalSubjects: 0,
      totalClasses: 0,
      activeTerms: 0,
    };
  }
}

export async function getTeachingLayoutStats() {
  try {
    const totalTeachers = await prisma.staff.count({
      where: { tenantId: DEFAULT_TENANT_ID, department: "ACADEMICS" }
    });

    const totalAllocations = await prisma.subjectAllocation.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    
    const avgWorkload = totalTeachers > 0 ? Math.round(totalAllocations / totalTeachers * 5) : 0; 
    // Just a rough dummy math for lessons per week assuming 5 lessons per allocation

    return {
      totalTeachers,
      avgWorkload,
    };
  } catch (error) {
    return {
      totalTeachers: 0,
      avgWorkload: 0,
    };
  }
}

export async function getAssessmentLayoutStats() {
  try {
    // There are no dedicated Assessment models in Prisma yet like CBT/Rubric, 
    // so we return placeholders that the UI will use until the models are built
    return {
      cbcAssessments: 124,
      exceedingExpectations: "45%",
      activeRubrics: 12,
      pendingReviews: 5,
    };
  } catch (error) {
    return {
      cbcAssessments: 0,
      exceedingExpectations: "0%",
      activeRubrics: 0,
      pendingReviews: 0,
    };
  }
}

export async function getSchedulingLayoutStats() {
  try {
    const totalTerms = await prisma.academicTerm.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    
    // Fallback numbers for things not in schema yet
    return {
      activeTimetables: 12,
      upcomingEvents: 3,
      dailyPeriods: 9,
      conflicts: 0,
      totalTerms,
    };
  } catch (error) {
    return {
      activeTimetables: 0,
      upcomingEvents: 0,
      dailyPeriods: 0,
      conflicts: 0,
      totalTerms: 0,
    };
  }
}

export async function getResourcesLayoutStats() {
  try {
    // There are no dedicated Resources models in Prisma yet, 
    // so we return placeholders that the UI will use until the models are built
    return {
      totalMaterials: 1248,
      activeDownloads: 342,
      videoHours: 86,
      newAdditions: 24,
    };
  } catch (error) {
    return {
      totalMaterials: 0,
      activeDownloads: 0,
      videoHours: 0,
      newAdditions: 0,
    };
  }
}
