import React from "react";
import FinanceClient from "./FinanceClient";
import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export default async function FinancePage() {
  const parents = await prisma.parent.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      students: {
        include: {
          student: {
            include: {
              invoices: true
            }
          }
        }
      }
    }
  });

  let totalOutstanding = 0;

  const data = parents.map(parent => {
    let balance = 0;
    const linkedStudents: { name: string; isSponsor: boolean }[] = [];
    const invoices: any[] = [];
    let isSponsorCount = 0;

    parent.students.forEach(sp => {
      linkedStudents.push({
        name: `${sp.student.firstName} ${sp.student.lastName}`,
        isSponsor: sp.isFinancialSponsor
      });
      if (sp.isFinancialSponsor) {
        isSponsorCount++;
        sp.student.invoices.forEach(inv => {
          balance += inv.balanceDue;
          invoices.push({
            ...inv,
            dueDate: inv.dueDate.toISOString(),
            issueDate: inv.issueDate.toISOString()
          });
        });
      }
    });

    let hasOverdue = false;
    const now = new Date();
    invoices.forEach(inv => {
      if (inv.balanceDue > 0 && new Date(inv.dueDate) < now) {
        hasOverdue = true;
      }
    });

    const finalStatus = balance === 0 ? "Cleared" : hasOverdue ? "Overdue" : "Pending";

    if (balance > 0) totalOutstanding += balance;
    
    // Sort invoices by date desc
    invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return {
      id: parent.id,
      parentName: `${parent.firstName} ${parent.lastName}`,
      linkedStudents,
      responsibility: isSponsorCount > 0 ? "Yes" : "No",
      balance,
      lastStatement: invoices.length > 0 ? new Date(invoices[0].issueDate).toLocaleDateString() : "N/A",
      status: finalStatus,
      invoices
    };
  });

  const clearedAccounts = data.filter(d => d.status === "Cleared").length;
  const pendingAccounts = data.filter(d => d.status === "Pending" || d.status === "Overdue").length;

  return (
    <FinanceClient 
      data={data as any} 
      kpis={{
        totalOutstanding,
        clearedAccounts,
        pendingAccounts,
        statementsSent: 426 // Mocked
      }} 
    />
  );
}