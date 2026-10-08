import React from "react";
import prisma from "@/lib/prisma";
import { getPayments, getPaymentStats } from "./actions";
import PaymentsClient from "./payments-client";

export default async function PaymentsReceiptsPage() {
  const tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    return <div>No tenant found. Please configure the system.</div>;
  }

  const payments = await getPayments(tenant.id);
  const stats = await getPaymentStats(tenant.id);

  return (
    <PaymentsClient 
      payments={payments} 
      stats={stats} 
      tenantId={tenant.id}
    />
  );
}
