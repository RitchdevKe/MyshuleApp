"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getActivities(limit = 20, filter: string = "All", cursorDate?: Date) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }

  const { tenantId } = session;
  const take = limit;
  
  // Base date filter
  const dateFilter = cursorDate ? { lt: cursorDate } : undefined;

  const [auditLogs, commLogs, announcements, disciplinaryLogs] = await Promise.all([
    (filter === "All" || filter === "Audit" || filter === "System") ? prisma.auditLog.findMany({
      where: { tenantId, createdAt: dateFilter },
      orderBy: { createdAt: 'desc' },
      take,
      include: { user: { select: { email: true } } }
    }) : [],
    
    (filter === "All" || filter === "Communication") ? prisma.communicationLog.findMany({
      where: { tenantId, sentAt: dateFilter },
      orderBy: { sentAt: 'desc' },
      take,
      include: { recipientUser: { select: { email: true } } }
    }) : [],

    (filter === "All" || filter === "Announcement") ? prisma.announcement.findMany({
      where: { tenantId, publishDate: dateFilter },
      orderBy: { publishDate: 'desc' },
      take,
      include: { createdBy: { select: { email: true } } }
    }) : [],

    (filter === "All" || filter === "Disciplinary") ? prisma.disciplinaryIncident.findMany({
      where: { tenantId, incidentDate: dateFilter },
      orderBy: { incidentDate: 'desc' },
      take,
      include: { 
        student: { select: { firstName: true, lastName: true } },
        reportedBy: { select: { firstName: true, lastName: true } }
      }
    }) : []
  ]);

  const activities = [
    ...auditLogs.map((log) => {
      let category = "Admin";
      const entity = log.entityName.toLowerCase();
      if (entity.includes("student") || entity.includes("admission")) category = "Admission";
      else if (entity.includes("book") || entity.includes("library")) category = "Library";
      else if (entity.includes("exam") || entity.includes("academic") || entity.includes("mark")) category = "Academic";
      else if (entity.includes("fee") || entity.includes("payment") || entity.includes("finance")) category = "Finance";
      else if (entity.includes("bus") || entity.includes("transport") || entity.includes("route")) category = "Transport";
      else if (entity.includes("staff") || entity.includes("hr") || entity.includes("leave")) category = "HR";

      return {
        id: `audit-${log.id}`,
        time: log.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: log.createdAt,
        title: `${log.action} ${log.entityName}`,
        description: `Performed by ${log.user?.email || 'System'}`,
        type: category,
        rawType: 'Audit'
      };
    }),
    ...commLogs.map((log) => ({
      id: `comm-${log.id}`,
      time: log.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: log.sentAt,
      title: log.subject || `Message sent via ${log.channel}`,
      description: `To: ${log.recipientUser?.email || log.contactAddress}`,
      type: "Communication",
      rawType: 'Communication'
    })),
    ...announcements.map((ann) => ({
      id: `ann-${ann.id}`,
      time: ann.publishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: ann.publishDate,
      title: `Announcement: ${ann.title}`,
      description: `Published by ${ann.createdBy?.email || 'System'}`,
      type: "Announcement",
      rawType: 'Announcement'
    })),
    ...disciplinaryLogs.map((disc) => ({
      id: `disc-${disc.id}`,
      time: disc.incidentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: disc.incidentDate,
      title: `Disciplinary Incident: ${disc.severity}`,
      description: `Student: ${disc.student?.firstName} ${disc.student?.lastName} - Reported by: ${disc.reportedBy?.firstName} ${disc.reportedBy?.lastName}`,
      type: "Disciplinary",
      rawType: 'Disciplinary'
    }))
  ];

  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  let filtered = activities;
  if (filter !== "All") {
    filtered = activities.filter(a => a.type === filter || a.rawType === filter);
  }

  return filtered.slice(0, limit);
}

export async function getRightPanelData() {
  const session = await getSession();
  if (!session?.tenantId) return { approvals: [], birthdays: [] };

  const { tenantId } = session;

  const [leaveRequests, budgetApprovals] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: { tenantId, status: "Pending" },
      include: { staff: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    }).catch(() => []),
    prisma.budgetApproval.findMany({
      where: { tenantId, status: "PENDING" },
      include: { budget: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    }).catch(() => [])
  ]);

  const approvals = [
    ...leaveRequests.map(lr => ({
      id: `leave-${lr.id}`,
      title: `Leave Request: ${lr.staff?.firstName} ${lr.staff?.lastName}`,
      subtitle: `${lr.type} Leave`,
      type: 'Leave',
      action: 'Approve'
    })),
    ...budgetApprovals.map(ba => ({
      id: `budget-${ba.id}`,
      title: ba.budget?.name || 'Budget Approval',
      subtitle: 'Requires Signature',
      type: 'Budget',
      action: 'Approve'
    }))
  ];

  const [students, staff] = await Promise.all([
    prisma.student.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 2
    }).catch(() => []),
    prisma.staff.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 1
    }).catch(() => [])
  ]);

  const birthdays = [
    ...students.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      role: 'Student'
    })),
    ...staff.map(s => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      role: s.jobTitle || 'Staff'
    }))
  ].slice(0, 3); // max 3

  return { approvals, birthdays };
}
