import React from 'react';
import ActiveStudentHeader from '../components/ActiveStudentHeader';
import { getParentPortalData } from '../data';
import prisma from "@/lib/prisma";
import FeesClientComponent from './FeesClientComponent';

export default async function FeesPage() {
  const { activeStudent } = await getParentPortalData();
  if (!activeStudent) return null;

  const invoices = await prisma.invoice.findMany({
    where: { studentId: activeStudent.id },
    orderBy: { issueDate: 'desc' },
    include: { academicTerm: true }
  });

  const payments = await prisma.payment.findMany({
    where: { studentId: activeStudent.id },
    orderBy: { paymentDate: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
      <ActiveStudentHeader />
      <FeesClientComponent invoices={invoices} payments={payments} />
    </div>
  );
}
