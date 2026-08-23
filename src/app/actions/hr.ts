import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "T-001"; // Should be resolved from session eventually

export async function getEmployeeLayoutStats() {
  try {
    const totalStaff = await prisma.staff.count({
      where: { tenantId: DEFAULT_TENANT_ID, status: "ACTIVE" }
    });
    
    return {
      totalEmployees: totalStaff,
      newHires: 0, // Need Hire Date logic
      contractRenewals: 0, // Need Contract model
      openPositions: await prisma.jobOpening.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Active" } }),
    };
  } catch (error) {
    return { totalEmployees: 0, newHires: 0, contractRenewals: 0, openPositions: 0 };
  }
}

export async function getPayrollLayoutStats() {
  try {
    const payrollRuns = await prisma.payrollRun.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const lastRunTotal = 0;
    const employeesPaid = 0;
    
    return {
      lastRunTotal,
      employeesPaid,
      activeStructures: await prisma.salaryStructure.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
      pendingPayslips: await prisma.payslip.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Pending" } }),
    };
  } catch (error) {
    return { lastRunTotal: 0, employeesPaid: 0, activeStructures: 0, pendingPayslips: 0 };
  }
}

export async function getRecruitmentLayoutStats() {
  try {
    return {
      activeOpenings: await prisma.jobOpening.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Active" } }),
      totalApplicants: await prisma.applicant.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
      scheduledInterviews: await prisma.interview.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Scheduled" } }),
      inOnboarding: await prisma.onboarding.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
    };
  } catch (error) {
    return { activeOpenings: 0, totalApplicants: 0, scheduledInterviews: 0, inOnboarding: 0 };
  }
}

export async function getAttendanceLayoutStats() {
  try {
    // For now returning defaults since Attendance Models are complex or not fully mapped to HR yet
    return {
      presentToday: 0,
      onLeave: 0,
      pendingRequests: 0,
      timesheetsDue: 0,
    };
  } catch (error) {
    return { presentToday: 0, onLeave: 0, pendingRequests: 0, timesheetsDue: 0 };
  }
}

export async function getPerformanceLayoutStats() {
  try {
    return {
      activeAppraisals: await prisma.appraisal.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "In Progress" } }),
      goalsMet: await prisma.goal.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Completed" } }),
      feedbackSessions: await prisma.feedback.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
      needsReview: await prisma.appraisal.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Pending" } }),
    };
  } catch (error) {
    return { activeAppraisals: 0, goalsMet: 0, feedbackSessions: 0, needsReview: 0 };
  }
}

export async function getTrainingLayoutStats() {
  try {
    return {
      activePrograms: await prisma.trainingProgram.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Active" } }),
      totalEnrolled: 0, // Needs relation mapping
      pendingRequests: await prisma.trainingRequest.count({ where: { tenantId: DEFAULT_TENANT_ID, status: "Pending" } }),
      certificationsEarned: await prisma.certification.count({ where: { tenantId: DEFAULT_TENANT_ID } }),
    };
  } catch (error) {
    return { activePrograms: 0, totalEnrolled: 0, pendingRequests: 0, certificationsEarned: 0 };
  }
}
