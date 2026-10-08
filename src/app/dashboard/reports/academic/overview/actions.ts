"use server";

import prisma from "@/lib/prisma";

export async function applyFilter(formData: FormData) {
  console.log("Applying filter:", Object.fromEntries(formData));
  return { success: true };
}

export async function getOverviewData() {
  const [allResults, totalStudents, attendanceRecords] = await Promise.all([
    prisma.examResult.findMany({
      where: { numericScore: { not: null } },
      include: {
        exam: {
          include: {
            academicTerm: true
          }
        },
        subject: true,
        student: true
      }
    }),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.attendanceRecord.findMany({
      include: {
        register: {
          include: {
            academicTerm: true
          }
        }
      }
    })
  ]);

  if (allResults.length === 0) {
    return {
      overallAverage: "0.0",
      passRate: "0.0",
      studentsImproved: "0",
      studentsDeclining: "0",
      outstanding: 0,
      atRisk: 0,
      trendData: [],
      topSubjects: [],
      totalStudents,
      attendanceRate: "0.0"
    };
  }

  let totalScore = 0;
  let passCount = 0;
  
  const subjectScores: Record<string, { total: number; count: number; name: string }> = {};
  const termScores: Record<string, { total: number; count: number; name: string, startDate: Date }> = {};
  const studentTermAverages: Record<string, Record<string, { total: number; count: number }>> = {};
  
  allResults.forEach(r => {
    const score = r.numericScore!;
    totalScore += score;
    if (score >= 50) passCount++;
    
    if (!subjectScores[r.subjectId]) {
      subjectScores[r.subjectId] = { total: 0, count: 0, name: r.subject.name };
    }
    subjectScores[r.subjectId].total += score;
    subjectScores[r.subjectId].count += 1;
    
    const termId = r.exam.academicTermId;
    if (!termScores[termId]) {
      termScores[termId] = { 
        total: 0, 
        count: 0, 
        name: r.exam.academicTerm.name,
        startDate: r.exam.academicTerm.startDate
      };
    }
    termScores[termId].total += score;
    termScores[termId].count += 1;

    if (!studentTermAverages[r.studentId]) {
      studentTermAverages[r.studentId] = {};
    }
    if (!studentTermAverages[r.studentId][termId]) {
      studentTermAverages[r.studentId][termId] = { total: 0, count: 0 };
    }
    studentTermAverages[r.studentId][termId].total += score;
    studentTermAverages[r.studentId][termId].count += 1;
  });

  const overallAverage = totalScore / allResults.length;
  const passRate = (passCount / allResults.length) * 100;

  const sortedTerms = Object.values(termScores).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const trendData = sortedTerms.map(t => ({
    name: t.name,
    average: t.total / t.count
  }));

  const processedSubjects = Object.values(subjectScores)
    .map(s => ({ name: s.name, average: s.total / s.count }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 3);

  let outstanding = 0;
  let atRisk = 0;
  let studentsImproved = 0;
  let studentsDeclining = 0;
  
  const latestTerm = sortedTerms.length > 0 ? sortedTerms[sortedTerms.length - 1] : null;
  const previousTerm = sortedTerms.length > 1 ? sortedTerms[sortedTerms.length - 2] : null;

  Object.values(studentTermAverages).forEach(termsData => {
    if (latestTerm) {
      const latestTermId = Object.keys(termScores).find(k => termScores[k].name === latestTerm.name)!;
      const latestData = termsData[latestTermId];
      if (latestData) {
        const avg = latestData.total / latestData.count;
        if (avg >= 80) outstanding++;
        if (avg < 40) atRisk++;
      }
      
      if (previousTerm) {
        const prevTermId = Object.keys(termScores).find(k => termScores[k].name === previousTerm.name)!;
        const prevData = termsData[prevTermId];
        if (latestData && prevData) {
          const latestAvg = latestData.total / latestData.count;
          const prevAvg = prevData.total / prevData.count;
          if (latestAvg > prevAvg) studentsImproved++;
          else if (latestAvg < prevAvg) studentsDeclining++;
        }
      }
    }
  });

  const totalStudentsWithCompare = studentsImproved + studentsDeclining;
  const improvedPercentage = totalStudentsWithCompare > 0 ? (studentsImproved / totalStudentsWithCompare) * 100 : 0;
  const decliningPercentage = totalStudentsWithCompare > 0 ? (studentsDeclining / totalStudentsWithCompare) * 100 : 0;

  let presentCount = 0;
  attendanceRecords.forEach(r => {
    if (r.status === "PRESENT" || r.status === "LATE") {
      presentCount++;
    }
  });
  const attendanceRate = attendanceRecords.length > 0 ? (presentCount / attendanceRecords.length) * 100 : 0;

  return {
    overallAverage: overallAverage.toFixed(1),
    passRate: passRate.toFixed(1),
    studentsImproved: improvedPercentage.toFixed(0),
    studentsDeclining: decliningPercentage.toFixed(0),
    outstanding,
    atRisk,
    trendData: trendData.map(t => ({ ...t, average: t.average.toFixed(1) })),
    topSubjects: processedSubjects.map(s => ({ ...s, average: s.average.toFixed(1) })),
    totalStudents,
    attendanceRate: attendanceRate.toFixed(1)
  };
}

