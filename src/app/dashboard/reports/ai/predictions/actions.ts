"use server";

import prisma from "@/lib/prisma";

export async function getPredictions(tenantId: string) {
  // 1. Projected Revenue (from Invoices)
  // Let's sum balanceDue on all UNPAID/PARTIAL invoices to represent projected cash inflow
  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId,
      status: { in: ["UNPAID", "PARTIALLY_PAID"] }
    }
  });

  const projectedRevenue = invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  
  // Calculate a mock growth rate based on amount paid vs total
  const amountPaidTotal = invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
  const revenueGrowthPercent = totalRevenue > 0 ? ((totalRevenue - amountPaidTotal) / totalRevenue) * 100 : 0;

  // 2. Academic At-Risk Students (from ReportCard)
  const reportCards = await prisma.reportCard.findMany({
    where: {
      tenantId,
      averageScore: {
        lt: 50 // Considering < 50 as at-risk
      }
    },
    include: {
      student: true,
      exam: true
    }
  });

  const atRiskStudents = reportCards.map(rc => ({
    studentId: rc.studentId,
    name: `${rc.student.firstName} ${rc.student.lastName}`,
    admissionNumber: rc.student.admissionNumber,
    averageScore: rc.averageScore,
    examName: rc.exam.name,
    overallGrade: rc.overallGrade
  }));

  // General Predictions Structure
  return {
    projectedRevenue,
    revenueGrowthPercent,
    atRiskStudentsCount: atRiskStudents.length,
    atRiskStudents,
  };
}
