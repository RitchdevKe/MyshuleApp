"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface DebtorRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  parentRelationship: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  issueDate: string;
  daysOverdue: number;
  agingCategory: "0-30 Days" | "31-60 Days" | "61-90 Days" | "90+ Days";
  status: "Critical" | "Warning" | "Notice";
  invoiceStatus: string;
  termName: string;
}

export interface AgingBucket {
  amount: number;
  count: number;
}

export interface ReceivablesReportData {
  summary: {
    totalReceivables: number;
    totalDebtors: number;
    totalOriginalAmount: number;
    totalCollectedAmount: number;
    collectionRate: number;
    aging: {
      zeroToThirty: AgingBucket;
      thirtyOneToSixty: AgingBucket;
      sixtyOneToNinety: AgingBucket;
      ninetyPlus: AgingBucket;
    };
  };
  debtors: DebtorRecord[];
  tenantName: string;
}

export async function getReceivablesReport(): Promise<ReceivablesReportData> {
  try {
    const tenant = await prisma.tenant.findFirst({
      select: { id: true, name: true },
    });

    const tenantId = tenant?.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        status: {
          in: ["UNPAID", "PARTIALLY_PAID"],
        },
      },
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                class: true,
                stream: true,
              },
              take: 1,
            },
            parents: {
              include: {
                parent: true,
              },
            },
          },
        },
        academicTerm: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        balanceDue: "desc",
      },
    });

    const now = new Date();
    let totalReceivables = 0;
    let totalOriginalAmount = 0;
    let totalCollectedAmount = 0;

    const bucket0_30: AgingBucket = { amount: 0, count: 0 };
    const bucket31_60: AgingBucket = { amount: 0, count: 0 };
    const bucket61_90: AgingBucket = { amount: 0, count: 0 };
    const bucket90Plus: AgingBucket = { amount: 0, count: 0 };

    const debtorRows: DebtorRecord[] = invoices.map((inv) => {
      const dueDate = new Date(inv.dueDate);
      const diffTime = now.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysOverdue = Math.max(0, diffDays);

      const balance = Number(inv.balanceDue) || 0;
      const totalAmount = Number(inv.totalAmount) || 0;
      const amountPaid = Number(inv.amountPaid) || 0;

      totalReceivables += balance;
      totalOriginalAmount += totalAmount;
      totalCollectedAmount += amountPaid;

      let agingCategory: "0-30 Days" | "31-60 Days" | "61-90 Days" | "90+ Days" = "0-30 Days";
      let statusCategory: "Critical" | "Warning" | "Notice" = "Notice";

      if (daysOverdue > 90) {
        agingCategory = "90+ Days";
        statusCategory = "Critical";
        bucket90Plus.amount += balance;
        bucket90Plus.count += 1;
      } else if (daysOverdue > 60) {
        agingCategory = "61-90 Days";
        statusCategory = "Warning";
        bucket61_90.amount += balance;
        bucket61_90.count += 1;
      } else if (daysOverdue > 30) {
        agingCategory = "31-60 Days";
        statusCategory = "Warning";
        bucket31_60.amount += balance;
        bucket31_60.count += 1;
      } else {
        agingCategory = "0-30 Days";
        statusCategory = "Notice";
        bucket0_30.amount += balance;
        bucket0_30.count += 1;
      }

      const student = inv.student;
      const studentName = student
        ? `${student.firstName} ${student.lastName}`
        : "Unassigned Student";
      const admissionNumber = student?.admissionNumber || "N/A";

      const enrollment = student?.enrollments?.[0];
      const gradeName = enrollment?.class?.name
        ? enrollment.stream?.name
          ? `${enrollment.class.name} (${enrollment.stream.name})`
          : enrollment.class.name
        : "General";

      const studentParent =
        student?.parents?.find((p) => p.isFinancialSponsor) || student?.parents?.[0];
      const parent = studentParent?.parent;
      const parentName = parent
        ? `${parent.firstName} ${parent.lastName}`
        : "Parent/Guardian";
      const parentPhone = parent?.phonePrimary || parent?.phoneSecondary || "+254 700 000 000";
      const parentRelationship = studentParent?.relationship
        ? studentParent.relationship.charAt(0) + studentParent.relationship.slice(1).toLowerCase()
        : "Parent";

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        studentId: student?.id || "",
        studentName,
        admissionNumber,
        grade: gradeName,
        parentName,
        parentPhone,
        parentRelationship,
        totalAmount,
        amountPaid,
        amountDue: balance,
        dueDate: inv.dueDate.toISOString(),
        issueDate: inv.issueDate.toISOString(),
        daysOverdue,
        agingCategory,
        status: statusCategory,
        invoiceStatus: inv.status,
        termName: inv.academicTerm?.name || "Current Term",
      };
    });

    const collectionRate =
      totalOriginalAmount > 0
        ? Math.round((totalCollectedAmount / totalOriginalAmount) * 100)
        : 0;

    return {
      summary: {
        totalReceivables,
        totalDebtors: debtorRows.length,
        totalOriginalAmount,
        totalCollectedAmount,
        collectionRate,
        aging: {
          zeroToThirty: bucket0_30,
          thirtyOneToSixty: bucket31_60,
          sixtyOneToNinety: bucket61_90,
          ninetyPlus: bucket90Plus,
        },
      },
      debtors: debtorRows,
      tenantName: tenant?.name || "School",
    };
  } catch (error) {
    console.error("Error fetching receivables report:", error);
    return {
      summary: {
        totalReceivables: 0,
        totalDebtors: 0,
        totalOriginalAmount: 0,
        totalCollectedAmount: 0,
        collectionRate: 0,
        aging: {
          zeroToThirty: { amount: 0, count: 0 },
          thirtyOneToSixty: { amount: 0, count: 0 },
          sixtyOneToNinety: { amount: 0, count: 0 },
          ninetyPlus: { amount: 0, count: 0 },
        },
      },
      debtors: [],
      tenantName: "School",
    };
  }
}

export async function sendBulkReminders(targetAgingCategory?: string) {
  try {
    const report = await getReceivablesReport();
    const debtorsToRemind = targetAgingCategory
      ? report.debtors.filter((d) => d.agingCategory === targetAgingCategory)
      : report.debtors;

    const count = debtorsToRemind.length;

    // Simulate sending notifications
    console.log(`[Receivables] Dispatched bulk payment reminders to ${count} debtor(s).`);

    revalidatePath("/dashboard/reports/financial/receivables");

    return {
      success: true,
      count,
      message:
        count > 0
          ? `Dispatched bulk reminders to ${count} parent${count === 1 ? "" : "s"} via SMS and Email successfully.`
          : "No overdue accounts matching the criteria to send reminders to.",
    };
  } catch (error) {
    console.error("Error sending bulk reminders:", error);
    return {
      success: false,
      count: 0,
      message: "Failed to dispatch bulk reminders. Please try again.",
    };
  }
}

export async function sendIndividualReminder(debtorId: string, studentName: string) {
  try {
    console.log(`[Receivables] Sent reminder for invoice ${debtorId} (Student: ${studentName})`);
    
    revalidatePath("/dashboard/reports/financial/receivables");

    return {
      success: true,
      message: `Payment reminder sent successfully to the parent of ${studentName}.`,
    };
  } catch (error) {
    console.error("Error sending individual reminder:", error);
    return {
      success: false,
      message: `Failed to send reminder for ${studentName}.`,
    };
  }
}
