"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getPerformanceData(filters?: { termId?: string; classId?: string }) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const { tenantId } = session;

  const whereClause: any = { tenantId };
  if (filters?.termId) {
    whereClause.exam = { academicTermId: filters.termId };
  }
  if (filters?.classId) {
    whereClause.student = {
       enrollments: {
          some: { classId: filters.classId }
       }
    };
  }

  // Fetch all exam results for the tenant
  const results = await prisma.examResult.findMany({
    where: whereClause,
    include: {
      subject: true,
      student: {
        include: {
          enrollments: {
            include: {
              class: true,
            }
          }
        }
      }
    }
  });

  // Calculate subject averages
  const subjectStats: Record<string, { total: number, count: number, name: string }> = {};
  
  // Calculate class averages
  const classStats: Record<string, { total: number, count: number, name: string, subjectScores: Record<string, { total: number, count: number }> }> = {};

  results.forEach(result => {
    if (result.numericScore === null) return;
    
    // Subject stats
    if (!subjectStats[result.subjectId]) {
      subjectStats[result.subjectId] = { total: 0, count: 0, name: result.subject.name };
    }
    subjectStats[result.subjectId].total += result.numericScore;
    subjectStats[result.subjectId].count += 1;

    // Class stats
    const enrollments = result.student.enrollments;
    if (enrollments && enrollments.length > 0) {
      // just take the first enrollment for simplicity or the active one
      const className = enrollments[0].class.name;
      const classId = enrollments[0].class.id;
      
      if (!classStats[classId]) {
        classStats[classId] = { total: 0, count: 0, name: className, subjectScores: {} };
      }
      classStats[classId].total += result.numericScore;
      classStats[classId].count += 1;
      
      if (!classStats[classId].subjectScores[result.subjectId]) {
         classStats[classId].subjectScores[result.subjectId] = { total: 0, count: 0 };
      }
      classStats[classId].subjectScores[result.subjectId].total += result.numericScore;
      classStats[classId].subjectScores[result.subjectId].count += 1;
    }
  });

  const subjects = Object.values(subjectStats).map(stat => ({
    name: stat.name,
    avg: Math.round((stat.total / stat.count) * 10) / 10,
    trend: 0, // Mock trend for now as we need historical data for real trend
    status: "steady" as "improving" | "declining" | "steady"
  })).sort((a, b) => b.avg - a.avg);

  const classes = Object.values(classStats).map(stat => {
     let bestSubject = { name: "", avg: 0 };
     let worstSubject = { name: "", avg: 100 };
     
     Object.entries(stat.subjectScores).forEach(([subId, subStat]) => {
        const avg = subStat.total / subStat.count;
        const subName = subjectStats[subId].name;
        if (avg > bestSubject.avg) bestSubject = { name: subName, avg: Math.round(avg) };
        if (avg < worstSubject.avg) worstSubject = { name: subName, avg: Math.round(avg) };
     });
     
     return {
        name: stat.name,
        avg: Math.round((stat.total / stat.count) * 10) / 10,
        bestSubject,
        worstSubject
     };
  }).sort((a, b) => b.avg - a.avg);

  const topClass = classes.length > 0 ? classes[0] : null;
  const needsInterventionClass = classes.length > 1 ? classes[classes.length - 1] : (classes.length === 1 && classes[0].avg < 60 ? classes[0] : null);

  return {
    subjects,
    topClass,
    needsInterventionClass
  };
}

export async function getFilterOptions() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const { tenantId } = session;

  const [terms, classes] = await Promise.all([
    prisma.academicTerm.findMany({
      where: { tenantId },
      orderBy: { startDate: 'desc' },
      select: { id: true, name: true }
    }),
    prisma.class.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ]);

  return { terms, classes };
}

