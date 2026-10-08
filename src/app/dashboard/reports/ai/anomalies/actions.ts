"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAnomalies() {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }

  const tenantId = session.tenantId;

  // 1. Financial anomalies: Overdue Invoices with large balances
  const massiveInvoices = await prisma.invoice.findMany({
    where: {
      tenantId,
      status: { in: ["UNPAID", "PARTIALLY_PAID"] },
      dueDate: { lt: new Date() },
      balanceDue: { gt: 1000 },
    },
    include: {
      student: true,
    },
    take: 5,
    orderBy: { balanceDue: "desc" },
  });

  // 2. Behavioral anomalies: Spikes in DisciplinaryIncidents (Recent Severe)
  const severeIncidents = await prisma.disciplinaryIncident.findMany({
    where: {
      tenantId,
      severity: "SEVERE",
      status: "OPEN",
    },
    include: {
      student: true,
      reportedBy: true,
    },
    take: 5,
    orderBy: { incidentDate: "desc" },
  });

  // 3. Operational anomalies: MaintenanceRecords pending too long
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const pendingMaintenance = await prisma.maintenanceRecord.findMany({
    where: {
      tenantId,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      createdAt: { lt: oneMonthAgo },
    },
    include: {
      asset: true,
    },
    take: 5,
    orderBy: { createdAt: "asc" },
  });

  return {
    massiveInvoices,
    severeIncidents,
    pendingMaintenance,
  };
}

export async function getAnomalyLogs(entityType: string, entityId: string) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }

  // Find related audit logs or specific history based on the entity
  if (entityType === "MAINTENANCE") {
    const record = await prisma.maintenanceRecord.findUnique({
      where: { id: entityId },
      include: { asset: true },
    });
    return record ? [record] : [];
  }
  
  if (entityType === "DISCIPLINE") {
      const incident = await prisma.disciplinaryIncident.findUnique({
          where: { id: entityId },
          include: { student: true, reportedBy: true }
      });
      return incident ? [incident] : [];
  }
  
  if (entityType === "INVOICE") {
      const invoice = await prisma.invoice.findUnique({
          where: { id: entityId },
          include: { payments: true }
      })
      return invoice?.payments || [];
  }

  return [];
}
