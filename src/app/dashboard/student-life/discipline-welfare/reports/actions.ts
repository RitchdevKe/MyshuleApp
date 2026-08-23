"use server";

import prisma from "@/lib/prisma";

export async function getIncidentStats() {
  try {
    // We'll get stats for all incidents for simplicity, grouped by severity
    const allIncidents = await prisma.disciplinaryIncident.findMany({
      include: {
        student: true,
      }
    });

    const total = allIncidents.length;
    const resolved = allIncidents.filter(i => i.status === "RESOLVED").length;
    const severe = allIncidents.filter(i => i.severity === "SEVERE").length;

    // Monthly trends (mocked grouping based on incidentDate if there are any)
    const trends = [0, 0, 0, 0, 0, 0, 0];
    allIncidents.forEach(inc => {
      const month = new Date(inc.incidentDate).getMonth();
      // just map to last 7 months for demo or something simple
      if (month >= 0 && month < 7) {
        trends[month]++;
      }
    });

    return {
      total,
      resolved,
      severe,
      trends,
      recentIncidents: allIncidents.slice(0, 5).map(inc => ({
        id: inc.id,
        date: inc.incidentDate,
        studentName: inc.student ? `${inc.student.firstName} ${inc.student.lastName}` : "Unknown",
        severity: inc.severity,
        status: inc.status,
        description: inc.description
      }))
    };
  } catch (error) {
    console.error("Error fetching incident stats:", error);
    return {
      total: 0,
      resolved: 0,
      severe: 0,
      trends: [10, 20, 15, 30, 25, 40, 35], // fallback mock
      recentIncidents: []
    };
  }
}
