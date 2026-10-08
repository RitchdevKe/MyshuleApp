"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface FeeReportFilters {
  academicYearId?: string;
  termId?: string;
  classId?: string;
}

export interface ClassFeeSummary {
  classId: string;
  className: string;
  expected: number;
  collected: number;
  outstanding: number;
  percent: number;
  studentCount: number;
  fullyPaidCount: number;
  arrearsCount: number;
}

export interface StreamFeeSummary {
  streamId: string;
  streamName: string;
  classId: string;
  className: string;
  expected: number;
  collected: number;
  outstanding: number;
  percent: number;
  studentCount: number;
}

export interface RecentPaymentRecord {
  id: string;
  receiptNumber: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber: string | null;
}

export interface FeeReportData {
  metrics: {
    totalExpected: number;
    totalCollected: number;
    totalOutstanding: number;
    collectionRate: number;
    studentsWithArrears: number;
    totalInvoices: number;
    paidInvoicesCount: number;
    partialInvoicesCount: number;
    unpaidInvoicesCount: number;
    overdueAmount: number;
    overdueCount: number;
  };
  classBreakdown: ClassFeeSummary[];
  streamBreakdown: StreamFeeSummary[];
  recentPayments: RecentPaymentRecord[];
  agingSummary: {
    days0to30: number;
    days31to60: number;
    days61to90: number;
    days90Plus: number;
  };
}

export interface FilterOptions {
  years: { id: string; name: string; isActiveYear: boolean }[];
  terms: { id: string; name: string; isActiveTerm: boolean; academicYearId: string }[];
  classes: {
    id: string;
    name: string;
    streams: { id: string; name: string }[];
  }[];
}

async function getTenantId(): Promise<string | null> {
  try {
    const session = await getSession();
    if (session?.tenantId) return session.tenantId;
    const firstTenant = await prisma.tenant.findFirst({ select: { id: true } });
    return firstTenant?.id ?? null;
  } catch (error) {
    console.error("Error retrieving tenant ID:", error);
    return null;
  }
}

export async function getFeeFilterOptions(): Promise<FilterOptions> {
  try {
    const tenantId = await getTenantId();

    const [years, terms, classes] = await Promise.all([
      prisma.academicYear.findMany({
        where: tenantId ? { tenantId } : {},
        orderBy: { startDate: "desc" },
        select: { id: true, name: true, isActiveYear: true },
      }),
      prisma.academicTerm.findMany({
        where: tenantId ? { tenantId } : {},
        orderBy: { startDate: "desc" },
        select: { id: true, name: true, isActiveTerm: true, academicYearId: true },
      }),
      prisma.class.findMany({
        where: tenantId ? { tenantId } : {},
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          streams: {
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          },
        },
      }),
    ]);

    return { years, terms, classes };
  } catch (error) {
    console.error("Error fetching fee filter options:", error);
    return { years: [], terms: [], classes: [] };
  }
}

export async function getFeeReportData(filters?: FeeReportFilters): Promise<FeeReportData> {
  try {
    const tenantId = await getTenantId();

    // 1. Base Class & Stream Maps
    const allClasses = await prisma.class.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        streams: true,
      },
      orderBy: { name: "asc" },
    });

    const classMap: Record<
      string,
      {
        classId: string;
        className: string;
        expected: number;
        collected: number;
        outstanding: number;
        studentIds: Set<string>;
        fullyPaidCount: number;
        arrearsCount: number;
      }
    > = {};

    const streamMap: Record<
      string,
      {
        streamId: string;
        streamName: string;
        classId: string;
        className: string;
        expected: number;
        collected: number;
        outstanding: number;
        studentIds: Set<string>;
      }
    > = {};

    for (const cls of allClasses) {
      classMap[cls.id] = {
        classId: cls.id,
        className: cls.name,
        expected: 0,
        collected: 0,
        outstanding: 0,
        studentIds: new Set<string>(),
        fullyPaidCount: 0,
        arrearsCount: 0,
      };

      for (const stream of cls.streams) {
        streamMap[stream.id] = {
          streamId: stream.id,
          streamName: stream.name,
          classId: cls.id,
          className: cls.name,
          expected: 0,
          collected: 0,
          outstanding: 0,
          studentIds: new Set<string>(),
        };
      }
    }

    // 2. Build Invoice Where Clause
    const invoiceWhere: any = {};
    if (tenantId) invoiceWhere.tenantId = tenantId;

    if (filters?.termId && filters.termId !== "all") {
      invoiceWhere.academicTermId = filters.termId;
    } else if (filters?.academicYearId && filters.academicYearId !== "all") {
      invoiceWhere.academicTerm = {
        academicYearId: filters.academicYearId,
      };
    }

    // Exclude cancelled invoices
    invoiceWhere.status = { notIn: ["CANCELLED"] };

    // Fetch Invoices
    const invoices = await prisma.invoice.findMany({
      where: invoiceWhere,
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                class: true,
                stream: true,
              },
              orderBy: {
                academicYear: {
                  startDate: "desc",
                },
              },
            },
          },
        },
        academicTerm: {
          include: {
            academicYear: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
      },
      orderBy: { issueDate: "desc" },
    });

    // 3. Compute Metrics & Aggregations
    let totalExpected = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let paidInvoicesCount = 0;
    let partialInvoicesCount = 0;
    let unpaidInvoicesCount = 0;
    let overdueAmount = 0;
    let overdueCount = 0;

    const studentsWithArrearsSet = new Set<string>();
    const now = new Date();

    let aging0to30 = 0;
    let aging31to60 = 0;
    let aging61to90 = 0;
    let aging90Plus = 0;

    for (const invoice of invoices) {
      // Determine student's class and stream for this invoice's term / academic year
      const invoiceYearId = invoice.academicTerm?.academicYearId;
      let matchedEnrollment = invoice.student?.enrollments.find(
        (e) => e.academicYearId === invoiceYearId
      );
      if (!matchedEnrollment && invoice.student?.enrollments.length) {
        matchedEnrollment = invoice.student.enrollments[0];
      }

      const classId = matchedEnrollment?.classId ?? "unassigned";
      const className = matchedEnrollment?.class?.name ?? "Unassigned";
      const streamId = matchedEnrollment?.streamId ?? "unassigned";
      const streamName = matchedEnrollment?.stream?.name ?? "General";

      // Filter by classId if provided
      if (filters?.classId && filters.classId !== "all" && classId !== filters.classId) {
        continue;
      }

      totalExpected += invoice.totalAmount;
      totalCollected += invoice.amountPaid;
      totalOutstanding += invoice.balanceDue;

      if (invoice.balanceDue <= 0 || invoice.status === "PAID") {
        paidInvoicesCount++;
      } else if (invoice.amountPaid > 0 && invoice.balanceDue > 0) {
        partialInvoicesCount++;
        studentsWithArrearsSet.add(invoice.studentId);
      } else {
        unpaidInvoicesCount++;
        studentsWithArrearsSet.add(invoice.studentId);
      }

      // Check overdue & aging for outstanding balance
      if (invoice.balanceDue > 0) {
        const dueDate = new Date(invoice.dueDate);
        if (dueDate < now) {
          overdueAmount += invoice.balanceDue;
          overdueCount++;
        }

        const diffTime = Math.max(0, now.getTime() - dueDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
          aging0to30 += invoice.balanceDue;
        } else if (diffDays <= 60) {
          aging31to60 += invoice.balanceDue;
        } else if (diffDays <= 90) {
          aging61to90 += invoice.balanceDue;
        } else {
          aging90Plus += invoice.balanceDue;
        }
      }

      // Aggregate into Class
      if (!classMap[classId]) {
        classMap[classId] = {
          classId,
          className,
          expected: 0,
          collected: 0,
          outstanding: 0,
          studentIds: new Set<string>(),
          fullyPaidCount: 0,
          arrearsCount: 0,
        };
      }
      classMap[classId].expected += invoice.totalAmount;
      classMap[classId].collected += invoice.amountPaid;
      classMap[classId].outstanding += invoice.balanceDue;
      if (invoice.studentId) classMap[classId].studentIds.add(invoice.studentId);

      if (invoice.balanceDue <= 0) {
        classMap[classId].fullyPaidCount++;
      } else {
        classMap[classId].arrearsCount++;
      }

      // Aggregate into Stream
      if (!streamMap[streamId]) {
        streamMap[streamId] = {
          streamId,
          streamName,
          classId,
          className,
          expected: 0,
          collected: 0,
          outstanding: 0,
          studentIds: new Set<string>(),
        };
      }
      streamMap[streamId].expected += invoice.totalAmount;
      streamMap[streamId].collected += invoice.amountPaid;
      streamMap[streamId].outstanding += invoice.balanceDue;
      if (invoice.studentId) streamMap[streamId].studentIds.add(invoice.studentId);
    }

    // 4. Transform Class & Stream Breakdown arrays
    let classBreakdown: ClassFeeSummary[] = Object.values(classMap).map((c) => ({
      classId: c.classId,
      className: c.className,
      expected: c.expected,
      collected: c.collected,
      outstanding: c.outstanding,
      percent: c.expected > 0 ? Math.round((c.collected / c.expected) * 100) : 0,
      studentCount: c.studentIds.size,
      fullyPaidCount: c.fullyPaidCount,
      arrearsCount: c.arrearsCount,
    }));

    if (filters?.classId && filters.classId !== "all") {
      classBreakdown = classBreakdown.filter((c) => c.classId === filters.classId);
    }

    // Sort classes by name
    classBreakdown.sort((a, b) => a.className.localeCompare(b.className));

    let streamBreakdown: StreamFeeSummary[] = Object.values(streamMap).map((s) => ({
      streamId: s.streamId,
      streamName: s.streamName,
      classId: s.classId,
      className: s.className,
      expected: s.expected,
      collected: s.collected,
      outstanding: s.outstanding,
      percent: s.expected > 0 ? Math.round((s.collected / s.expected) * 100) : 0,
      studentCount: s.studentIds.size,
    }));

    if (filters?.classId && filters.classId !== "all") {
      streamBreakdown = streamBreakdown.filter((s) => s.classId === filters.classId);
    }

    streamBreakdown.sort((a, b) => {
      const classCompare = a.className.localeCompare(b.className);
      if (classCompare !== 0) return classCompare;
      return a.streamName.localeCompare(b.streamName);
    });

    // 5. Fetch Recent Payments
    const paymentWhere: any = {};
    if (tenantId) paymentWhere.tenantId = tenantId;

    if (filters?.termId && filters.termId !== "all") {
      paymentWhere.invoice = { academicTermId: filters.termId };
    } else if (filters?.academicYearId && filters.academicYearId !== "all") {
      paymentWhere.invoice = {
        academicTerm: { academicYearId: filters.academicYearId },
      };
    }

    const payments = await prisma.payment.findMany({
      where: paymentWhere,
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                class: true,
                stream: true,
              },
              orderBy: {
                academicYear: { startDate: "desc" },
              },
              take: 1,
            },
          },
        },
        invoice: true,
      },
      orderBy: { paymentDate: "desc" },
      take: 20,
    });

    const recentPayments: RecentPaymentRecord[] = payments.map((p) => {
      const studentClass =
        p.student?.enrollments?.[0]?.class?.name || "General";
      const studentStream =
        p.student?.enrollments?.[0]?.stream?.name || "";
      const classLabel = studentStream ? `${studentClass} (${studentStream})` : studentClass;

      return {
        id: p.id,
        receiptNumber: p.receiptNumber,
        studentName: p.student
          ? `${p.student.firstName} ${p.student.lastName}`
          : "Unassigned Student",
        admissionNumber: p.student?.admissionNumber || "—",
        className: classLabel,
        amount: p.amount,
        paymentMethod: p.paymentMethod.replace(/_/g, " "),
        paymentDate: p.paymentDate.toISOString(),
        referenceNumber: p.referenceNumber,
      };
    });

    const collectionRate =
      totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 1000) / 10 : 0;

    return {
      metrics: {
        totalExpected,
        totalCollected,
        totalOutstanding,
        collectionRate,
        studentsWithArrears: studentsWithArrearsSet.size,
        totalInvoices: invoices.length,
        paidInvoicesCount,
        partialInvoicesCount,
        unpaidInvoicesCount,
        overdueAmount,
        overdueCount,
      },
      classBreakdown,
      streamBreakdown,
      recentPayments,
      agingSummary: {
        days0to30: aging0to30,
        days31to60: aging31to60,
        days61to90: aging61to90,
        days90Plus: aging90Plus,
      },
    };
  } catch (error) {
    console.error("Error generating fee report data:", error);
    return {
      metrics: {
        totalExpected: 0,
        totalCollected: 0,
        totalOutstanding: 0,
        collectionRate: 0,
        studentsWithArrears: 0,
        totalInvoices: 0,
        paidInvoicesCount: 0,
        partialInvoicesCount: 0,
        unpaidInvoicesCount: 0,
        overdueAmount: 0,
        overdueCount: 0,
      },
      classBreakdown: [],
      streamBreakdown: [],
      recentPayments: [],
      agingSummary: {
        days0to30: 0,
        days31to60: 0,
        days61to90: 0,
        days90Plus: 0,
      },
    };
  }
}
