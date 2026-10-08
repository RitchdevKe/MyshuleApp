import React from "react";
import prisma from "@/lib/prisma";
import DiscountClient from "./DiscountClient";

export default async function DiscountsPage() {
  const invoicesWithDiscounts = await prisma.invoice.findMany({
    where: { discount: { gt: 0 } },
    include: { student: true },
    orderBy: { issueDate: 'desc' }
  });

  const allInvoices = await prisma.invoice.findMany({
    include: { student: true },
    orderBy: { issueDate: 'desc' }
  });

  return <DiscountClient initialInvoices={invoicesWithDiscounts} allInvoices={allInvoices} />;
}
