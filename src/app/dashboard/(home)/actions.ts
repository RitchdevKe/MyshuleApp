import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getDashboardOverview(schoolLevel: string) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const tenantId = session.tenantId;

  // 1. Students
  const totalStudents = await prisma.student.count({ where: { tenantId, status: 'ACTIVE' } });
  const boys = await prisma.student.count({ where: { tenantId, status: 'ACTIVE', gender: 'MALE' } });
  const girls = await prisma.student.count({ where: { tenantId, status: 'ACTIVE', gender: 'FEMALE' } });

  // 2. Staff
  const totalStaff = await prisma.staff.count({ where: { tenantId, status: 'ACTIVE' } });
  
  // Since gender is String? for Staff, we handle possible casings
  const staffRecords = await prisma.staff.findMany({
    where: { tenantId, status: 'ACTIVE' },
    select: { gender: true }
  });
  
  const maleStaff = staffRecords.filter(s => s.gender?.toLowerCase() === 'male' || s.gender?.toLowerCase() === 'm').length;
  const femaleStaff = staffRecords.filter(s => s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'f').length;

  // 3. Finance (Invoices & Payments)
  const invoicesAgg = await prisma.invoice.aggregate({
    where: { tenantId },
    _sum: {
      totalAmount: true,
      amountPaid: true,
    }
  });

  const totalExpected = invoicesAgg._sum.totalAmount || 0;
  const totalCollected = invoicesAgg._sum.amountPaid || 0;

  // Revenue by Month (from Payments)
  // Fetch all payments for this tenant and group by month locally for simplicity
  const payments = await prisma.payment.findMany({
    where: { tenantId, status: 'ALLOCATED' },
    select: { amount: true, paymentDate: true }
  });

  const revenueByMonth = new Map<string, number>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Initialize current year months to 0
  months.forEach(m => revenueByMonth.set(m, 0));

  payments.forEach(p => {
    const d = new Date(p.paymentDate);
    // If it's this year
    if (d.getFullYear() === new Date().getFullYear()) {
      const m = months[d.getMonth()];
      revenueByMonth.set(m, (revenueByMonth.get(m) || 0) + p.amount);
    }
  });

  // Expected by month from Invoices
  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    select: { totalAmount: true, issueDate: true }
  });

  const expectedByMonth = new Map<string, number>();
  months.forEach(m => expectedByMonth.set(m, 0));

  invoices.forEach(inv => {
    const d = new Date(inv.issueDate);
    if (d.getFullYear() === new Date().getFullYear()) {
      const m = months[d.getMonth()];
      expectedByMonth.set(m, (expectedByMonth.get(m) || 0) + inv.totalAmount);
    }
  });

  const revenueData = months.slice(0, Math.max(new Date().getMonth() + 1, 3)).map(m => ({
    name: m,
    expected: expectedByMonth.get(m) || 0,
    collected: revenueByMonth.get(m) || 0
  }));

  // 4. Attendance Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const attendanceRegisters = await prisma.attendanceRegister.findMany({
    where: {
      tenantId,
      date: {
        gte: today
      }
    },
    include: {
      records: true
    }
  });

  let presentCount = 0;
  let absentCount = 0;

  attendanceRegisters.forEach(reg => {
    reg.records.forEach(rec => {
      if (rec.status === 'PRESENT' || rec.status === 'LATE') {
        presentCount++;
      } else {
        absentCount++;
      }
    });
  });

  let attendancePercentage = 0;
  if (presentCount + absentCount > 0) {
    attendancePercentage = (presentCount / (presentCount + absentCount)) * 100;
  }

  // 5. Enrollment Distribution
  // Get all students with their class/branch
  const studentEnrollments = await prisma.studentEnrollment.findMany({
    where: { 
      tenantId, 
      student: { status: 'ACTIVE' } 
    },
    include: {
      class: {
        include: {
          branch: true
        }
      }
    }
  });

  let prePrimary = 0;
  let primary = 0;
  let junior = 0;
  let senior = 0;

  studentEnrollments.forEach(enr => {
    const levels = enr.class?.branch?.levelTypes || [];
    if (levels.includes('PRE_PRIMARY')) prePrimary++;
    else if (levels.includes('PRIMARY')) primary++;
    else if (levels.includes('JUNIOR')) junior++;
    else if (levels.includes('SENIOR')) senior++;
    else {
      // Fallback heuristic based on class name
      const name = enr.class?.name.toLowerCase() || '';
      if (name.includes('pp') || name.includes('play')) prePrimary++;
      else if (name.includes('grade') && name.match(/grade [1-6]/)) primary++;
      else if (name.includes('grade') && name.match(/grade [7-9]/)) junior++;
      else if (name.includes('grade') && name.match(/grade 1[0-2]/)) senior++;
      else primary++; // Default
    }
  });

  const enrollmentData = [
    { name: "Pre-Primary", value: prePrimary },
    { name: "Primary", value: primary },
    { name: "Junior", value: junior },
    { name: "Senior", value: senior },
  ].filter(d => d.value > 0);

  // Fallback if no enrollment data yet, just so chart isn't empty
  if (enrollmentData.length === 0) {
    enrollmentData.push({ name: "Unassigned", value: totalStudents || 1 });
  }

  // 6. Performance (Real Data Aggregation)
  const examResults = await prisma.examResult.findMany({
    where: { tenantId },
    include: {
      exam: true,
      student: {
        include: {
          enrollments: {
            include: {
              class: {
                include: {
                  branch: true
                }
              }
            }
          }
        }
      }
    }
  });

  const levelPerformance: Record<string, { catScores: number[], examScores: number[] }> = {
    "Pre-Primary": { catScores: [], examScores: [] },
    "Primary": { catScores: [], examScores: [] },
    "Junior": { catScores: [], examScores: [] },
    "Senior": { catScores: [], examScores: [] },
  };

  examResults.forEach(res => {
    if (res.numericScore != null) {
      // Determine level
      let level = "Primary"; // default
      const enr = res.student?.enrollments?.[0];
      if (enr) {
        const levels = enr.class?.branch?.levelTypes || [];
        if (levels.includes('PRE_PRIMARY')) level = "Pre-Primary";
        else if (levels.includes('PRIMARY')) level = "Primary";
        else if (levels.includes('JUNIOR')) level = "Junior";
        else if (levels.includes('SENIOR')) level = "Senior";
        else {
          const name = enr.class?.name.toLowerCase() || '';
          if (name.includes('pp') || name.includes('play')) level = "Pre-Primary";
          else if (name.includes('grade') && name.match(/grade [1-6]/)) level = "Primary";
          else if (name.includes('grade') && name.match(/grade [7-9]/)) level = "Junior";
          else if (name.includes('grade') && name.match(/grade 1[0-2]/)) level = "Senior";
        }
      }

      // Determine if CAT or FINAL
      const examName = res.exam?.name.toLowerCase() || '';
      if (examName.includes('cat') || examName.includes('mid') || examName.includes('continuous')) {
        levelPerformance[level].catScores.push(res.numericScore);
      } else {
        // default to exam
        levelPerformance[level].examScores.push(res.numericScore);
      }
    }
  });

  const performanceData = Object.entries(levelPerformance).map(([grade, scores]) => {
    const catAvg = scores.catScores.length > 0 ? scores.catScores.reduce((a, b) => a + b, 0) / scores.catScores.length : 0;
    const examAvg = scores.examScores.length > 0 ? scores.examScores.reduce((a, b) => a + b, 0) / scores.examScores.length : 0;
    const average = (catAvg + examAvg) / (catAvg > 0 && examAvg > 0 ? 2 : 1);
    
    return {
      grade,
      cat: Number(catAvg.toFixed(1)),
      exam: Number(examAvg.toFixed(1)),
      average: Number(average.toFixed(1)),
    };
  }).filter(p => p.cat > 0 || p.exam > 0);

  // Fallback if no performance data exists
  if (performanceData.length === 0) {
    performanceData.push(
      { grade: "Pre-Primary", cat: 0, exam: 0, average: 0 },
      { grade: "Primary", cat: 0, exam: 0, average: 0 }
    );
  }

  return {
    stats: {
      students: totalStudents,
      boys,
      girls,
      staff: totalStaff,
      maleStaff,
      femaleStaff,
      attendance: attendancePercentage.toFixed(1),
      absent: absentCount
    },
    revenue: revenueData,
    enrollment: enrollmentData,
    performance: performanceData,
    totalExpected,
    totalCollected
  };
}
