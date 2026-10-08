"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getExecutiveInsightSummary() {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }

  const tenantId = session.tenantId;

  const totalStudents = await prisma.student.count({ where: { tenantId, status: "ACTIVE" } });
  const totalStaff = await prisma.staff.count({ where: { tenantId, status: "ACTIVE" } });
  
  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    select: {
      totalAmount: true,
      amountPaid: true,
      balanceDue: true,
    }
  });

  const totalRevenueExpected = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalRevenueCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const collectionRate = totalRevenueExpected > 0 ? (totalRevenueCollected / totalRevenueExpected) * 100 : 0;
  
  const financialHealth = collectionRate > 80 ? "Good" : collectionRate > 50 ? "Moderate" : "At Risk";

  const anomalies = [];
  if (totalOutstanding > totalRevenueExpected * 0.3 && totalRevenueExpected > 0) {
    anomalies.push({
      id: "anomaly-1",
      title: "High Outstanding Balance",
      description: `Over 30% of expected revenue is uncollected. Total outstanding: $${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}. This severely impacts cash flow and operational capability. Recommended action: Send automated reminders to all parents with unpaid invoices.`,
      severity: "High",
      type: "Financial"
    });
  }

  if (totalStaff > 0 && totalStudents > 0 && (totalStudents / totalStaff) < 20) {
      anomalies.push({
          id: "anomaly-2",
          title: "Low Student to Staff Ratio",
          description: `There are ${totalStudents} students and ${totalStaff} staff, making the ratio ${(totalStudents/totalStaff).toFixed(1)}:1. While good for academics, this may be financially unsustainable in the long run.`,
          severity: "Medium",
          type: "Operational"
      });
  }
  
  const oldUnpaidInvoices = await prisma.invoice.count({
      where: {
          tenantId,
          balanceDue: { gt: 0 },
          dueDate: { lt: new Date() }
      }
  });
  
  if (oldUnpaidInvoices > 0) {
      anomalies.push({
          id: "anomaly-3",
          title: "Overdue Invoices",
          description: `There are ${oldUnpaidInvoices} overdue invoices. This indicates potential defaults. Immediate action required.`,
          severity: "High",
          type: "Financial"
      });
  }

  const exams = await prisma.examResult.findMany({
    where: { tenantId },
    select: {
      numericScore: true,
    }
  });

  const validScores = exams.filter(e => e.numericScore !== null).map(e => e.numericScore as number);
  const averageScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;

  let academicInsight = "Not enough academic data to form an insight.";
  if (validScores.length > 0) {
      if (averageScore < 50) {
          academicInsight = `Average score is ${averageScore.toFixed(2)}. Suggest remedial actions for core subjects.`;
      } else if (averageScore > 75) {
          academicInsight = `Strong performance with an average score of ${averageScore.toFixed(2)}. Maintain current teaching methods.`;
      } else {
          academicInsight = `Average performance at ${averageScore.toFixed(2)}. Room for improvement in specific subjects.`;
      }
  }
  
  const summaryText = `The institution currently has ${totalStudents} active students and ${totalStaff} active staff members.
Financially, the school has collected $${totalRevenueCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })} out of an expected $${totalRevenueExpected.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${collectionRate.toFixed(1)}%).
Overall financial health is marked as: ${financialHealth}.
${academicInsight}`;

  return {
    metrics: {
      totalStudents,
      totalStaff,
      totalRevenueExpected,
      totalRevenueCollected,
      totalOutstanding,
      collectionRate,
      averageScore
    },
    insights: {
      financialHealth,
      academicInsight,
      summaryText,
    },
    anomalies,
  };
}
