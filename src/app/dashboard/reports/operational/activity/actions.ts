"use server";

import prisma from "@/lib/prisma";

export type ActivityType = "COMMUNICATION" | "AUDIT" | "ANNOUNCEMENT" | "SYSTEM";
export type ActivityChannel = "SMS" | "EMAIL" | "PUSH_NOTIFICATION" | "SYSTEM" | "ANNOUNCEMENT";
export type ActivityStatus = "DELIVERED" | "SENT" | "FAILED" | "SUCCESS" | "PUBLISHED" | "PENDING";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  channel: ActivityChannel;
  title: string;
  recipient: string;
  user: string;
  status: ActivityStatus;
  timestamp: string; // ISO string
  details: string;
  providerError?: string | null;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export interface ActivityStats {
  totalActivities: number;
  totalCommunications: number;
  totalEmails: number;
  totalSMS: number;
  totalPush: number;
  deliveredCount: number;
  failedCount: number;
  pendingCount: number;
  deliveryRate: number;
  systemEventsCount: number;
  announcementsCount: number;
}

export interface ActivityReportData {
  activities: ActivityItem[];
  stats: ActivityStats;
  channels: string[];
  statuses: string[];
}


function formatUserName(user: any): string {
  if (!user) return "System";
  if (user.staff && user.staff.length > 0) {
    const s = user.staff[0];
    return `${s.firstName} ${s.lastName} (${s.jobTitle || "Staff"})`;
  }
  if (user.students && user.students.length > 0) {
    const st = user.students[0];
    return `${st.firstName} ${st.lastName} (Student)`;
  }
  if (user.parents && user.parents.length > 0) {
    const p = user.parents[0];
    return `${p.firstName} ${p.lastName} (Parent)`;
  }
  return user.email || user.phoneNumber || "System User";
}

export async function getActivityReportData(): Promise<ActivityReportData> {
  try {
    const [communicationLogs, auditLogs, announcements] = await Promise.all([
      prisma.communicationLog.findMany({
        include: {
          recipientUser: {
            include: {
              staff: true,
              students: true,
              parents: true,
            }
          }
        },
        orderBy: { sentAt: "desc" },
        take: 100
      }).catch(() => []),

      prisma.auditLog.findMany({
        include: {
          user: {
            include: {
              staff: true,
              students: true,
              parents: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 100
      }).catch(() => []),

      prisma.announcement.findMany({
        include: {
          createdBy: {
            include: {
              staff: true,
            }
          },
          targetClass: true,
        },
        orderBy: { publishDate: "desc" },
        take: 50
      }).catch(() => []),
    ]);

    const formattedCommActivities: ActivityItem[] = communicationLogs.map((log) => {
      let status: ActivityStatus = "SENT";
      if (log.status === "DELIVERED") status = "DELIVERED";
      else if (log.status === "FAILED") status = "FAILED";

      const channelName = (log.channel as ActivityChannel) || "SMS";
      const recipientName = log.recipientUser ? formatUserName(log.recipientUser) : log.contactAddress;

      return {
        id: `COMM-${log.id.slice(0, 8).toUpperCase()}`,
        type: "COMMUNICATION",
        channel: channelName,
        title: log.subject || `${channelName} Notification`,
        recipient: `${recipientName} (${log.contactAddress})`,
        user: log.recipientUser ? formatUserName(log.recipientUser) : "System Dispatcher",
        status,
        timestamp: log.sentAt ? log.sentAt.toISOString() : new Date().toISOString(),
        details: log.body,
        providerError: log.providerError,
        metadata: {
          channel: log.channel,
          contactAddress: log.contactAddress,
          rawId: log.id,
        }
      };
    });

    const formattedAuditActivities: ActivityItem[] = auditLogs.map((log) => ({
      id: `AUDIT-${log.id.slice(0, 8).toUpperCase()}`,
      type: "AUDIT",
      channel: "SYSTEM",
      title: log.action,
      recipient: `Entity: ${log.entityName}`,
      user: formatUserName(log.user),
      status: "SUCCESS",
      timestamp: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
      details: `Action "${log.action}" executed on ${log.entityName}${log.ipAddress ? ` from IP ${log.ipAddress}` : ""}.`,
      metadata: {
        entityName: log.entityName,
        ipAddress: log.ipAddress,
        rawId: log.id,
      }
    }));

    const formattedAnnouncementActivities: ActivityItem[] = announcements.map((annc) => ({
      id: `ANNC-${annc.id.slice(0, 8).toUpperCase()}`,
      type: "ANNOUNCEMENT",
      channel: "ANNOUNCEMENT",
      title: annc.title,
      recipient: `Audience: ${annc.targetAudience}${annc.targetClass ? ` (${annc.targetClass.name})` : ""}`,
      user: formatUserName(annc.createdBy),
      status: "PUBLISHED",
      timestamp: annc.publishDate ? annc.publishDate.toISOString() : new Date().toISOString(),
      details: annc.content,
      metadata: {
        targetAudience: annc.targetAudience,
        rawId: annc.id,
      }
    }));

    // Combine all and sort descending by timestamp
    let combinedActivities = [
      ...formattedCommActivities,
      ...formattedAuditActivities,
      ...formattedAnnouncementActivities
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Compute stats
    const totalActivities = combinedActivities.length;
    const comms = combinedActivities.filter((a) => a.type === "COMMUNICATION");
    const totalCommunications = comms.length;
    const totalEmails = combinedActivities.filter((a) => a.channel === "EMAIL").length;
    const totalSMS = combinedActivities.filter((a) => a.channel === "SMS").length;
    const totalPush = combinedActivities.filter((a) => a.channel === "PUSH_NOTIFICATION").length;
    const deliveredCount = combinedActivities.filter((a) => a.status === "DELIVERED" || a.status === "SUCCESS" || a.status === "PUBLISHED").length;
    const failedCount = combinedActivities.filter((a) => a.status === "FAILED").length;
    const pendingCount = combinedActivities.filter((a) => a.status === "SENT" || a.status === "PENDING").length;
    
    const deliveryRate = totalActivities > 0 ? Math.round((deliveredCount / totalActivities) * 100) : 100;
    const systemEventsCount = combinedActivities.filter((a) => a.channel === "SYSTEM").length;
    const announcementsCount = combinedActivities.filter((a) => a.channel === "ANNOUNCEMENT").length;

    const stats: ActivityStats = {
      totalActivities,
      totalCommunications,
      totalEmails,
      totalSMS,
      totalPush,
      deliveredCount,
      failedCount,
      pendingCount,
      deliveryRate,
      systemEventsCount,
      announcementsCount,
    };

    return {
      activities: combinedActivities,
      stats,
      channels: ["ALL", "SMS", "EMAIL", "PUSH_NOTIFICATION", "SYSTEM", "ANNOUNCEMENT"],
      statuses: ["ALL", "DELIVERED", "SENT", "FAILED", "SUCCESS", "PUBLISHED", "PENDING"]
    };
  } catch (error) {
    console.error("Error fetching activity report data:", error);
    throw new Error("Failed to fetch activity report data");
  }
}
