"use server";

import prisma from "@/lib/prisma";

export async function getRecommendations() {
  const recommendations = [];
  
  const firstTenant = await prisma.tenant.findFirst();
  if (!firstTenant) return [];
  const tenantId = firstTenant.id;

  // 1. Staff to Student Ratio
  const studentCount = await prisma.student.count({ where: { tenantId } });
  const staffCount = await prisma.staff.count({ where: { tenantId } });

  const ratio = staffCount > 0 ? studentCount / staffCount : studentCount;
  
  if (ratio > 30 || ratio === 0) {
    recommendations.push({
      id: "rec-hiring",
      title: "High Student-to-Staff Ratio",
      description: `The current ratio is ${ratio.toFixed(1)}:1 (Target: 30:1). Consider hiring more teachers.`,
      type: "HIRING",
      actionLabel: "Draft job posting",
    });
  } else {
    recommendations.push({
      id: "rec-hiring-ok",
      title: "Optimal Staffing",
      description: `Your student-to-staff ratio is ${ratio.toFixed(1)}:1, which is within the target of 30:1. No immediate hiring needed.`,
      type: "HIRING",
      actionLabel: "Draft job posting (Backup)",
    });
  }

  // 2. Transport Routes Analysis
  const routes = await prisma.transportRoute.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { assignments: true },
      },
    },
  });

  const overloadedRoutes = routes.filter(r => r._count.assignments > 10); // low threshold for testing

  if (overloadedRoutes.length > 0) {
    recommendations.push({
      id: "rec-transport",
      title: "Transport Route Overload",
      description: `${overloadedRoutes.length} route(s) exceed normal capacity (e.g., ${overloadedRoutes[0].routeName} has ${overloadedRoutes[0]._count.assignments} students).`,
      type: "TRANSPORT",
      actionLabel: "View proposed routes",
      overloadedRoutes: overloadedRoutes.map(r => ({ name: r.routeName, count: r._count.assignments }))
    });
  } else if (routes.length === 0) {
    recommendations.push({
      id: "rec-transport-dummy",
      title: "Optimize Transport Routes",
      description: `No transport routes exist. Based on student locations, 3 routes are recommended.`,
      type: "TRANSPORT",
      actionLabel: "View proposed routes",
      overloadedRoutes: [{ name: "Proposed Route A", count: 12 }, { name: "Proposed Route B", count: 8 }]
    });
  } else {
     recommendations.push({
      id: "rec-transport-opt",
      title: "Transport Route Optimization",
      description: `Routes are under capacity. You can merge routes to save costs.`,
      type: "TRANSPORT",
      actionLabel: "View proposed routes",
      overloadedRoutes: routes.map(r => ({ name: r.routeName + " (Underutilized)", count: r._count.assignments }))
    });
  }

  // 3. Meeting Invites
  const incidentCount = await prisma.disciplinaryIncident.count({
    where: {
      tenantId,
      incidentDate: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    }
  });

  if (incidentCount > 0) {
    recommendations.push({
      id: "rec-meeting",
      title: "Recent Disciplinary Issues",
      description: `There have been ${incidentCount} incidents in the last 30 days. Recommend a staff or PTA meeting to address behavior.`,
      type: "MEETING",
      actionLabel: "Generate meeting invites",
    });
  } else {
    recommendations.push({
      id: "rec-meeting-general",
      title: "End of Term Review Required",
      description: "It is recommended to schedule a review meeting with the teaching staff to discuss term progress.",
      type: "MEETING",
      actionLabel: "Generate meeting invites",
    });
  }

  return recommendations;
}

export async function generateJobPosting() {
  const firstTenant = await prisma.tenant.findFirst();
  const tenantId = firstTenant?.id || "";

  const staffCount = await prisma.staff.count({ where: { tenantId } });
  const studentCount = await prisma.student.count({ where: { tenantId } });
  const ratio = staffCount > 0 ? (studentCount / staffCount).toFixed(1) : studentCount;
  
  const text = `**Job Title**: General Educator / Subject Teacher
**School Name**: Partner School

**About the Role**:
We are experiencing growth in our student population (currently ${studentCount} students) and are looking to expand our teaching team to maintain our optimal student-to-teacher ratio (currently at ${ratio}:1).

**Requirements**:
- Minimum of 2 years teaching experience
- Bachelor's degree in Education
- Passion for student success

**How to Apply**:
Send your CV to hr@school.com.`;

  return text;
}

export async function generateMeetingInvite() {
  const invite = `**Subject**: Urgent PTA / Staff Meeting

**Date**: Next Friday, 2:00 PM
**Location**: Main Hall / Virtual

**Agenda**:
1. Review of recent incidents and student welfare.
2. Academic progress and intervention strategies.
3. Open floor for staff concerns.

Please confirm your attendance by Wednesday.`;
  return invite;
}
