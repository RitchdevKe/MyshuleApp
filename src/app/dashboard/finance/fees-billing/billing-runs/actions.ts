"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function startBillingRun(formData: FormData) {
  const termId = formData.get("termId") as string;
  const feeStructureId = formData.get("feeStructureId") as string;

  if (!termId || !feeStructureId) {
    throw new Error("Missing termId or feeStructureId");
  }

  const feeStructure = await prisma.feeStructure.findUnique({
    where: { id: feeStructureId },
    include: {
      items: true,
    },
  });

  if (!feeStructure) {
    throw new Error("Fee structure not found");
  }

  // Find all students in this fee structure's class and academic year
  const enrollments = await prisma.studentEnrollment.findMany({
    where: {
      classId: feeStructure.classId,
      academicYearId: feeStructure.academicYearId,
    },
  });

  if (enrollments.length === 0) {
    throw new Error("No students found for this class and academic year.");
  }

  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

  await prisma.$transaction(
    enrollments.map((enrollment) => {
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      return prisma.invoice.create({
        data: {
          tenantId: feeStructure.tenantId,
          academicTermId: termId,
          studentId: enrollment.studentId,
          invoiceNumber,
          issueDate,
          dueDate,
          subTotal: feeStructure.totalAmount,
          totalAmount: feeStructure.totalAmount,
          balanceDue: feeStructure.totalAmount,
          status: "UNPAID",
          items: {
            create: feeStructure.items.map((item) => ({
              description: item.name,
              amount: item.amount,
            })),
          },
        },
      });
    })
  );

  revalidatePath("/dashboard/finance/fees-billing/billing-runs");
}
