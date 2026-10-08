import React from "react";
import prisma from "@/lib/prisma";
import AdjustmentsClient from "./AdjustmentsClient";

export default async function AdjustmentsPage() {
  const tenant = await prisma.tenant.findFirst();

  let adjustments = [];
  let invoices = [];

  if (tenant) {
    // Fetch adjustments (simulate by filtering invoice items with "Adjustment" in description)
    adjustments = await prisma.invoiceItem.findMany({
      where: {
        invoice: { tenantId: tenant.id },
        description: { contains: "Adjustment", mode: "insensitive" }
      },
      include: {
        invoice: {
          include: { student: true }
        }
      },
      orderBy: {
        id: "desc"
      }
    });

    invoices = await prisma.invoice.findMany({
      where: { tenantId: tenant.id },
      include: { student: true },
      orderBy: {
        invoiceNumber: "desc"
      }
    });
  }

  return <AdjustmentsClient adjustments={adjustments} invoices={invoices} />;
}
