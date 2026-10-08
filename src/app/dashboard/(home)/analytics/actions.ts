"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getAnalyticsData(yearId?: string, termId?: string) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const tenantId = session.tenantId;

  // Fetch filter options
  const academicYears = await prisma.academicYear.findMany({
    where: { tenantId },
    orderBy: { startDate: 'desc' },
  });

  let activeYearId = yearId;
  if (!activeYearId) {
    const activeYear = academicYears.find(y => y.isActiveYear) || academicYears[0];
    activeYearId = activeYear?.id;
  }

  const terms = activeYearId ? await prisma.academicTerm.findMany({
    where: { tenantId: tenantId, academicYearId: activeYearId },
    orderBy: { startDate: 'asc' },
  }) : [];

  let activeTermId = termId;
  if (!activeTermId && terms.length > 0) {
    const activeTerm = terms.find(t => t.isActiveTerm) || terms[0];
    activeTermId = activeTerm?.id;
  }

  // KPIs
  
  // Total Revenue (Payments for the active term if invoice is linked, or just generally in timeframe)
  // For simplicity, we can get Invoices for the active term, and their payments.
  let revenue = 0;
  if (activeTermId) {
    const termInvoices = await prisma.invoice.findMany({
      where: { tenantId: tenantId, academicTermId: activeTermId },
      include: { payments: true }
    });
    revenue = termInvoices.reduce((acc, inv) => {
      const paid = inv.payments.reduce((sum, p) => sum + (p.status === 'ALLOCATED' ? p.amount : 0), 0);
      return acc + paid;
    }, 0);
  } else {
     const payments = await prisma.payment.findMany({
       where: { tenantId: tenantId, status: 'ALLOCATED' }
     });
     revenue = payments.reduce((acc, p) => acc + p.amount, 0);
  }

  // Population
  const students = await prisma.student.findMany({
    where: { tenantId: tenantId, status: 'ACTIVE' },
    select: { gender: true }
  });
  const population = students.length;
  
  const boys = students.filter(s => s.gender === 'MALE').length;
  const girls = students.filter(s => s.gender === 'FEMALE').length;

  const popData = [
    { name: 'Boys', value: boys, color: '#0ea5e9' },
    { name: 'Girls', value: girls, color: '#ec4899' },
  ];

  // Mean Score
  let examResults = [];
  if (activeTermId) {
    examResults = await prisma.examResult.findMany({
      where: { 
        tenantId: tenantId,
        exam: { academicTermId: activeTermId }
      },
      include: { subject: true }
    });
  } else {
    examResults = await prisma.examResult.findMany({
      where: { tenantId: tenantId },
      include: { subject: true }
    });
  }
  
  const validScores = examResults.filter(er => er.numericScore != null);
  const totalScore = validScores.reduce((acc, curr) => acc + (curr.numericScore || 0), 0);
  const meanScoreNum = validScores.length > 0 ? (totalScore / validScores.length).toFixed(1) : "0.0";
  // Convert score to Grade roughly (A: >80, B: >60, etc.)
  let meanGrade = 'N/A';
  const msn = parseFloat(meanScoreNum);
  if (msn >= 80) meanGrade = 'A';
  else if (msn >= 70) meanGrade = 'B+';
  else if (msn >= 60) meanGrade = 'B';
  else if (msn >= 50) meanGrade = 'C+';
  else if (msn >= 40) meanGrade = 'C';
  else if (msn > 0) meanGrade = 'D';

  const meanScoreLabel = `${meanGrade} (${meanScoreNum})`;

  // Academic Bar Chart Data (Top Subjects)
  const subjectScores: Record<string, { total: number, count: number }> = {};
  validScores.forEach(er => {
    const sName = er.subject.name;
    if (!subjectScores[sName]) subjectScores[sName] = { total: 0, count: 0 };
    subjectScores[sName].total += (er.numericScore || 0);
    subjectScores[sName].count += 1;
  });
  
  const perfData = Object.keys(subjectScores).map(sub => ({
    subject: sub.substring(0, 3), // short name
    score: Math.round(subjectScores[sub].total / subjectScores[sub].count)
  })).sort((a, b) => b.score - a.score).slice(0, 5);

  // Avg Attendance
  let attendanceRecords = [];
  if (activeTermId) {
    attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        register: {
          academicTermId: activeTermId,
          tenantId: tenantId
        }
      }
    });
  } else {
    attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        register: { tenantId: tenantId }
      }
    });
  }
  
  const totalAtt = attendanceRecords.length;
  const presentAtt = attendanceRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'EXCUSED').length;
  const avgAttendance = totalAtt > 0 ? ((presentAtt / totalAtt) * 100).toFixed(1) + '%' : 'N/A';

  const latestRegisters = await prisma.attendanceRegister.findMany({
    where: { tenantId: tenantId, academicTermId: activeTermId || undefined },
    orderBy: { date: 'desc' },
    take: 25,
    include: { records: true }
  });

  const heatmapData = latestRegisters.map(reg => {
    const total = reg.records.length;
    const absent = reg.records.filter(r => r.status === 'ABSENT').length;
    return total > 0 ? Math.min(absent / total, 0.8) : 0;
  });

  while (heatmapData.length < 25) {
    heatmapData.push(0);
  }

  // Finance Line Chart (fee collection vs expected over months)
  // Let's get invoices grouped by month of issueDate.
  const invoices = await prisma.invoice.findMany({
    where: { tenantId: tenantId, academicTermId: activeTermId || undefined },
    include: { payments: true }
  });

  const monthMap: Record<string, { expected: number, collected: number }> = {};
  invoices.forEach(inv => {
    const m = new Date(inv.issueDate).toLocaleString('default', { month: 'short' });
    if (!monthMap[m]) monthMap[m] = { expected: 0, collected: 0 };
    monthMap[m].expected += inv.totalAmount;
    const paid = inv.payments.reduce((sum, p) => sum + (p.status === 'ALLOCATED' ? p.amount : 0), 0);
    monthMap[m].collected += paid;
  });

  const feeData = Object.keys(monthMap).map(m => ({
    month: m,
    expected: monthMap[m].expected,
    collected: monthMap[m].collected
  }));
  // If empty, provide mock structure so chart doesn't crash
  if (feeData.length === 0) {
    feeData.push({ month: 'Jan', expected: 0, collected: 0 });
  }

  return {
    academicYears,
    terms,
    activeYearId,
    activeTermId,
    revenue,
    population,
    popData,
    meanScoreLabel,
    perfData,
    avgAttendance,
    feeData
  };
}
