import { z } from "zod";
import prisma from "@/lib/prisma";

// Defines the structure of a tool in our registry
export type AITool = {
  name: string;
  description: string;
  requiredPermission: string;
  schema: z.ZodObject<any, any, any>;
  execute: (args: any, context: AIContext) => Promise<any>;
};

export type AIContext = {
  tenantId: string;
  userId: string;
};

// Tool: Search Students
export const searchStudentTool: AITool = {
  name: "search_students",
  description: "Search for students by name or admission number in the school.",
  requiredPermission: "students.view", // Reusing standard permissions
  schema: z.object({
    query: z.string().describe("The name or admission number of the student"),
  }),
  execute: async ({ query }, { tenantId }) => {
    const students = await prisma.student.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { admissionNumber: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNumber: true,
        status: true,
        enrollments: {
          select: {
            class: { select: { name: true } },
            stream: { select: { name: true } },
          },
        },
      },
      take: 5,
    });
    
    return students.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      admissionNumber: s.admissionNumber,
      status: s.status,
      class: s.enrollments[0]?.class?.name || "Unassigned",
      stream: s.enrollments[0]?.stream?.name || "Unassigned",
    }));
  },
};

// Tool: Get Fee Balance
export const getFeeBalanceTool: AITool = {
  name: "get_fee_balance",
  description: "Retrieve the outstanding fee balance for a specific student.",
  requiredPermission: "finance.view",
  schema: z.object({
    studentId: z.string().describe("The internal ID of the student (not admission number)"),
  }),
  execute: async ({ studentId }, { tenantId }) => {
    // Wait for Prisma to generate the correct client... Let's safely query Invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        tenantId,
        studentId,
        status: { in: ["UNPAID", "PARTIALLY_PAID"] },
      },
      select: {
        amount: true,
        paidAmount: true,
        dueDate: true,
      },
    });

    const totalDue = invoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);
    
    return {
      studentId,
      outstandingBalance: totalDue,
      invoiceCount: invoices.length,
      currency: "KES"
    };
  },
};

// Tool: Get Today's Attendance Summary
export const getTodayAttendanceSummaryTool: AITool = {
  name: "get_today_attendance_summary",
  description: "Get a summary of student attendance for today.",
  requiredPermission: "attendance.view",
  schema: z.object({}),
  execute: async ({}, { tenantId }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const registers = await prisma.attendanceRegister.findMany({
      where: {
        tenantId,
        date: { gte: today },
      },
      include: {
        records: {
          select: { status: true },
        }
      },
    });

    let totalRecords = 0;
    const summary: Record<string, number> = {};
    
    registers.forEach(reg => {
      reg.records.forEach(rec => {
        summary[rec.status] = (summary[rec.status] || 0) + 1;
        totalRecords++;
      });
    });

    return {
      date: today.toISOString().split("T")[0],
      totalRecords,
      summary,
    };
  },
};

// Tool: Get Financial Summary
export const getFinancialSummaryTool: AITool = {
  name: "get_financial_summary",
  description: "Get a high-level summary of school finances, including total revenue, pending invoices, and expenses.",
  requiredPermission: "finance.view",
  schema: z.object({}),
  execute: async ({}, { tenantId }) => {
    try {
      const invoices = await prisma.invoice.aggregate({
        where: { tenantId },
        _sum: { amount: true, balance: true, paidAmount: true },
      });
      return {
        totalInvoiced: invoices._sum.amount || 0,
        totalPaid: invoices._sum.paidAmount || 0,
        totalPendingBalance: invoices._sum.balance || 0,
        currency: "KES"
      };
    } catch(e) {
      return { error: "Could not fetch finances. Might not be implemented in db yet." };
    }
  },
};

// -----------------------------------------------------------------------------
// TOOL REGISTRY
// -----------------------------------------------------------------------------
export const aiTools: Record<string, AITool> = {
  search_students: searchStudentTool,
  get_fee_balance: getFeeBalanceTool,
  get_today_attendance_summary: getTodayAttendanceSummaryTool,
  get_financial_summary: getFinancialSummaryTool,
};
