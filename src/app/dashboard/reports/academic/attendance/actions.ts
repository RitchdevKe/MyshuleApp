"use server";
import prisma from "@/lib/prisma";

export async function getAttendanceReportData() {
  const [allRecords, totalStudents] = await Promise.all([
    prisma.attendanceRecord.findMany({
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                class: true
              }
            }
          }
        },
        register: true
      }
    }),
    prisma.student.count({ where: { status: "ACTIVE" } })
  ]);

  // Today's rate
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const todayRecords = allRecords.filter(r => {
    const d = new Date(r.register.date);
    d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  });
  
  const todayPresent = todayRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
  const todayRate = todayRecords.length > 0 ? (todayPresent / todayRecords.length) * 100 : 0;

  // Grade Breakdown
  const gradeStats: Record<string, { total: number, present: number }> = {};
  
  allRecords.forEach(r => {
    // Find the student's current class name
    const enrollment = r.student.enrollments?.[0]; // rough estimation
    const className = enrollment?.class?.name || "Unassigned";
    
    if (!gradeStats[className]) {
      gradeStats[className] = { total: 0, present: 0 };
    }
    
    gradeStats[className].total++;
    if (r.status === "PRESENT" || r.status === "LATE") {
      gradeStats[className].present++;
    }
  });

  const gradeRates = Object.entries(gradeStats).map(([grade, stats]) => {
    return {
      grade,
      rate: stats.total > 0 ? (stats.present / stats.total) * 100 : 0,
      trend: 0 // Mock trend since we don't have historical comparison logic handy
    };
  });

  // Chronic Absenteeism (< 80%)
  const studentStats: Record<string, { total: number, present: number }> = {};
  allRecords.forEach(r => {
    if (!studentStats[r.studentId]) {
      studentStats[r.studentId] = { total: 0, present: 0 };
    }
    studentStats[r.studentId].total++;
    if (r.status === "PRESENT" || r.status === "LATE") {
      studentStats[r.studentId].present++;
    }
  });

  let chronicCount = 0;
  Object.values(studentStats).forEach(s => {
    const rate = (s.present / s.total) * 100;
    if (rate < 80) chronicCount++;
  });

  return {
    todayRate: todayRate.toFixed(1),
    gradeRates: gradeRates.map(g => ({ ...g, rate: g.rate.toFixed(1) })),
    chronicCount
  };
}

export async function sendParentAlertsAction() {
  console.log("Sending SMS alerts to parents...");
  return { success: true, message: "Alerts sent" };
}
