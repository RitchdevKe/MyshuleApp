import React from "react";
import prisma from "@/lib/prisma";
import CustomReportsClient from "./client";

export default async function CustomReportsPage() {
  const reports = await prisma.customReport.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <CustomReportsClient initialReports={reports} />;
}
