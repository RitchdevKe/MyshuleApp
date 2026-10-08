"use server";

import prisma from "@/lib/prisma";

export async function getStudents() {
  return await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      admissionNumber: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });
}

export type Transaction = {
  id: string;
  date: Date;
  type: "INVOICE" | "PAYMENT";
  description: string;
  debit: number;
  credit: number;
  ref: string;
  balance: number;
};

export async function getStudentStatement(studentId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { studentId },
    include: {
      payments: true,
    },
  });

  const transactions: Omit<Transaction, "balance">[] = [];

  for (const invoice of invoices) {
    transactions.push({
      id: invoice.id,
      date: invoice.issueDate,
      type: "INVOICE",
      description: `Invoice ${invoice.invoiceNumber}`,
      debit: invoice.totalAmount,
      credit: 0,
      ref: invoice.invoiceNumber,
    });

    for (const payment of invoice.payments) {
      transactions.push({
        id: payment.id,
        date: payment.paymentDate,
        type: "PAYMENT",
        description: `Payment (Receipt: ${payment.receiptNumber})`,
        debit: 0,
        credit: payment.amount,
        ref: payment.receiptNumber,
      });
    }
  }

  // Sort by date ascending
  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate running balance
  let balance = 0;
  const statement: Transaction[] = transactions.map((t) => {
    balance = balance + t.debit - t.credit;
    return { ...t, balance };
  });

  return statement;
}
