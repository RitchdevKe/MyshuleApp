import React from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import IssueClient from "./IssueClient";

export default async function StockIssuesPage() {
  const session = await getSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const [issues, stores, items] = await Promise.all([
    prisma.stockIssue.findMany({
      where: { tenantId: session.tenantId },
      include: {
        item: { select: { name: true, unit: true } },
        store: { select: { name: true } },
      },
      orderBy: { date: 'desc' }
    }),
    prisma.store.findMany({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
      select: { id: true, name: true }
    }),
    prisma.inventoryItem.findMany({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
      select: { id: true, name: true, unit: true }
    })
  ]);

  const summary = {
    total: issues.length,
    pending: issues.filter(i => i.status === "PENDING").length,
    fulfilled: issues.filter(i => i.status === "COMPLETED").length,
    rejected: issues.filter(i => i.status === "REJECTED").length,
  };

  return (
    <IssueClient 
      issues={issues}
      stores={stores}
      items={items}
      summary={summary}
    />
  );
}
