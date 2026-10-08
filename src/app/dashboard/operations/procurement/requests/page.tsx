import React from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import RequestsClient from "./RequestsClient";

export default async function PurchaseRequestsPage() {
  const session = await getSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const requestsData = await prisma.purchaseRequest.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
  });

  const total = requestsData.length;
  const pending = requestsData.filter(r => r.status === "PENDING").length;
  const approvedValue = requestsData.filter(r => r.status === "APPROVED").reduce((acc, curr) => acc + curr.amount, 0);

  const summary = {
    total,
    pending,
    approvedValue
  };

  const serializedRequests = requestsData.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return <RequestsClient requests={serializedRequests as any} summary={summary} />;
}
