import React from "react";
import prisma from "@/lib/prisma";
import BillingRunsClient from "./BillingRunsClient";

export default async function BillingRunsPage() {
  // Fetch grouping
  const distinctRuns = await prisma.invoice.findMany({
    distinct: ["issueDate"],
    select: {
      issueDate: true,
      academicTerm: {
        select: { name: true },
      },
    },
    orderBy: {
      issueDate: "desc",
    },
  });

  const billingRuns = await Promise.all(
    distinctRuns.map(async (run) => {
      const stats = await prisma.invoice.aggregate({
        where: { issueDate: run.issueDate },
        _count: { id: true },
        _sum: { totalAmount: true },
      });

      return {
        ref: `BR-${run.issueDate.getTime()}`,
        date: run.issueDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        target: run.academicTerm?.name || "Unknown Term",
        count: stats._count.id.toString(),
        amount: (stats._sum.totalAmount || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        status: "Posted",
      };
    })
  );

  // Fetch data for modal
  const terms = await prisma.academicTerm.findMany({
    where: { isActiveTerm: true },
    select: {
      id: true,
      name: true,
      academicYear: { select: { name: true } },
    },
  });

  const feeStructures = await prisma.feeStructure.findMany({
    select: {
      id: true,
      name: true,
      totalAmount: true,
      class: { select: { name: true } },
      academicYear: { select: { name: true } },
    },
  });

  return (
    <BillingRunsClient
      billingRuns={billingRuns}
      terms={terms}
      feeStructures={feeStructures}
    />
  );
}
