import React from "react";
import { getHostelReportsData } from "./actions";
import ReportsClient from "./ReportsClient";
import prisma from "@/lib/prisma";

export default async function ReportsPage() {
  // Fetch tenantId for data filtering
  // In a real application, you would get this from a session/auth context
  let tenantId = "default";
  const tenant = await prisma.tenant.findFirst();
  if (tenant) {
    tenantId = tenant.id;
  }

  const { topCards, charts } = await getHostelReportsData(tenantId);

  return (
    <ReportsClient 
      topCards={topCards} 
      occupancyByHostel={charts.occupancyByHostel} 
      attendanceTrend={charts.attendanceTrend} 
    />
  );
}
