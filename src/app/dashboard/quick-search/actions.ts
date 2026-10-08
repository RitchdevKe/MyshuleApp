"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getQuickSearchStudents(tab: string, query: string) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const tenantId = session.tenantId;

  // We fetch students and conditionally filter them
  // Or fetch all relevant students and filter dynamically if it's small,
  // but better to fetch with Prisma where possible.
  
  // Actually, we can fetch all active students for this tenant
  // and compute their balances and status, then filter in memory
  // because calculating arrears per student requires summing invoices.
  
  const students = await prisma.student.findMany({
    where: { tenantId, status: "ACTIVE" },
    include: {
      enrollments: {
        include: {
          class: true
        }
      },
      parents: {
        include: {
          parent: true
        }
      },
      invoices: {
        where: { status: { not: "CANCELLED" } }
      },
      hostelAllocation: true
    }
  });

  const formattedStudents = students.map(student => {
    // Grade
    const activeEnrollment = student.enrollments[0];
    const grade = activeEnrollment?.class?.name || "Unassigned";

    // Phone
    const phone = student.parents[0]?.parent?.phoneNumber || "No Phone";

    // Balance calculation
    let totalAmount = 0;
    let amountPaid = 0;
    student.invoices.forEach(inv => {
      totalAmount += inv.totalAmount;
      amountPaid += (inv.amountPaid || 0);
    });
    const balance = Math.max(0, totalAmount - amountPaid);
    
    // Status
    const isCritical = balance > 15000;
    let status = "Cleared";
    if (isCritical) status = "Critical";
    else if (balance > 0) status = "Arrears";

    // Accommodation
    const isBoarder = student.hostelAllocation !== null;
    const accommodation = isBoarder ? "BOARDING" : "DAY";

    return {
      id: student.id,
      admissionNumber: student.admissionNumber,
      name: `${student.firstName} ${student.lastName}`,
      initials: `${student.firstName[0]}${student.lastName[0]}`,
      grade,
      status,
      balance,
      phone,
      accommodation,
      type: "student"
    };
  });

  // Filter based on tab
  let filtered = formattedStudents;
  
  if (tab === "fully-paid") {
    filtered = filtered.filter(s => s.balance === 0);
  } else if (tab === "unpaid") {
    filtered = filtered.filter(s => s.balance > 0 && s.balance <= 15000);
  } else if (tab === "critical-arrears") {
    filtered = filtered.filter(s => s.balance > 15000);
  } else if (tab === "boarders") {
    filtered = filtered.filter(s => s.accommodation === "BOARDING");
  } else if (tab === "day-scholars") {
    filtered = filtered.filter(s => s.accommodation === "DAY");
  }

  // Filter based on search query
  if (query && query.trim() !== "") {
    const lowerQuery = query.toLowerCase().trim();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.admissionNumber.toLowerCase().includes(lowerQuery) ||
      s.grade.toLowerCase().includes(lowerQuery) ||
      s.phone.includes(lowerQuery)
    );
  }

  // Limit to avoid sending massive data to client in one go
  // But for quick search, a hundred is fine
  return filtered.slice(0, 100);
}
