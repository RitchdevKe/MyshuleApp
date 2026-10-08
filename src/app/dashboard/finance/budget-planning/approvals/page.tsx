import React from "react";
import prisma from "@/lib/prisma";
import ApprovalsClient from "./ApprovalsClient";
import { ApprovalStatus } from "@prisma/client";

export default async function ApprovalsPage() {
  const approvals = await prisma.budgetApproval.findMany({
    orderBy: { createdAt: "desc" },
  });

  const budgetIds = approvals.map(a => a.budgetId);
  const budgets = await prisma.budget.findMany({
    where: { id: { in: budgetIds } }
  });

  const budgetMap = new Map(budgets.map(b => [b.id, b]));

  const mappedApprovals = approvals.map(approval => {
    const budget = budgetMap.get(approval.budgetId);
    
    // Map status enum to match the UI string
    let statusStr = "Pending";
    if (approval.status === ApprovalStatus.APPROVED) statusStr = "Approved";
    if (approval.status === ApprovalStatus.REJECTED) statusStr = "Rejected";

    return {
      originalId: approval.id,
      id: approval.id.split('-')[0] + "-" + approval.id.slice(-4).toUpperCase(), // Fake short ID
      reqDate: approval.createdAt.toLocaleDateString(),
      dept: "General", // Placeholder as there's no department mapping directly
      requestedBy: approval.requestedBy,
      amount: budget ? budget.totalAmount.toLocaleString() : "0",
      desc: approval.notes || budget?.name || "Budget Approval Request",
      type: "New Budget",
      status: statusStr,
      urgency: "Normal",
    };
  });

  return (
    <ApprovalsClient initialApprovals={mappedApprovals} />
  );
}
