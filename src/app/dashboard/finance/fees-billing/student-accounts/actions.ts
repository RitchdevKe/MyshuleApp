"use server";

import prisma from "@/lib/prisma";

export async function fetchStudentAccounts(filters?: {
  search?: string;
  classId?: string;
  arrearsOnly?: boolean;
}) {
  const { search, classId, arrearsOnly } = filters || {};

  const students = await prisma.student.findMany({
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
        take: 1,
      },
      invoices: {
        include: {
          payments: true,
        },
      },
    },
    where: {
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { admissionNumber: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(classId
        ? {
            enrollments: {
              some: {
                classId,
              },
            },
          }
        : {}),
    },
  });

  const formattedStudents = students.map((student) => {
    // Assuming opening balance is calculated from older terms, 
    // but here we just sum all invoices for simplicity, so op = 0.
    const openingBalance = 0;
    
    const charges = student.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const payments = student.invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const balanceDue = charges - payments; // Or sum of inv.balanceDue

    let status = "Cleared";
    if (balanceDue > 0) {
      // In this system, anything partially paid but not cleared is arrears?
      // Or if payments > 0, we can say "Partial", but let's stick to "Arrears" if due > 0
      status = payments > 0 ? (payments < charges ? "Partial" : "Arrears") : "Arrears";
      // Actually, if balanceDue > 0 and past due, it's arrears. 
      // We will classify > 0 as Arrears, and if partially paid "Partial" is fine.
      if (payments > 0 && balanceDue > 0) status = "Partial";
      if (payments === 0 && balanceDue > 0) status = "Arrears";
    } else if (balanceDue < 0) {
      status = "Overpaid";
    } else {
      status = "Cleared";
    }

    const latestEnrollment = student.enrollments[0];
    const className = latestEnrollment
      ? `${latestEnrollment.class.name} - ${latestEnrollment.stream.name}`
      : "Unassigned";

    return {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      adm: student.admissionNumber,
      class: className,
      classId: latestEnrollment?.classId,
      op: openingBalance,
      charges,
      paid: payments,
      bal: balanceDue,
      status,
    };
  });

  if (arrearsOnly) {
    return formattedStudents.filter(s => s.bal > 0);
  }

  return formattedStudents;
}

export async function fetchClasses() {
  return prisma.class.findMany({
    orderBy: { name: 'asc' }
  });
}
