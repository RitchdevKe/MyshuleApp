import React from "react";
import prisma from "@/lib/prisma";
import ReportsClient from "./ReportsClient";

export default async function LeadershipReportsPage() {
  // Fetch real counts to make the reports somewhat real
  const [totalStudents, disciplinaryIncidents] = await Promise.all([
    prisma.student.count().catch(() => 0), // Fallback to 0 if db not set up
    prisma.disciplinaryIncident.count().catch(() => 0),
  ]);

  const stats = {
    totalStudents,
    disciplinaryIncidents,
  };

  return (
    <div className="p-6">
      <ReportsClient initialStats={stats} />
    </div>
  );
}
