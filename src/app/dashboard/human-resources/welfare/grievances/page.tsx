import React from "react";
import prisma from "@/lib/prisma";
import GrievanceClient from "./GrievanceClient";

export default async function GrievancesPage() {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant?.id || "default";

  const grievances = await prisma.grievance.findMany({
    where: { tenantId },
    include: { staff: true },
    orderBy: { createdAt: "desc" },
  });

  const staffMembers = await prisma.staff.findMany({
    where: { tenantId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: "asc" }
  });

  const stats = {
    openCount: grievances.filter(g => g.status === "Open").length,
    investigatingCount: grievances.filter(g => g.status === "Investigating").length,
    resolvedCount: grievances.filter(g => g.status === "Resolved").length,
  };

  return (
    <GrievanceClient 
      initialGrievances={grievances} 
      tenantId={tenantId} 
      stats={stats} 
      staffMembers={staffMembers}
    />
  );
}
