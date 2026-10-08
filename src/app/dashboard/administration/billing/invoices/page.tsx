import React from "react";
import InvoicesClient from "./InvoicesClient";
import { getInvoices } from "@/app/actions/billing";
import prisma from "@/lib/prisma";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const students = await prisma.student.findMany({
    where: { tenantId: "1e8a93ff-1533-4f1a-b337-1473919ff7f2" },
    select: { id: true, firstName: true, lastName: true },
  });
  const terms = await prisma.academicTerm.findMany({
    where: { tenantId: "1e8a93ff-1533-4f1a-b337-1473919ff7f2" },
    select: { id: true, name: true },
  });

  return <InvoicesClient invoices={invoices} students={students} terms={terms} />;
}
