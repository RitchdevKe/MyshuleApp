import React from "react";
import prisma from "@/lib/prisma";
import { getAcademicYears } from "@/app/actions/academic";
import CalendarClient from "./CalendarClient";

// TODO: Replace with real tenant ID from auth context
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2"; 

export default async function CalendarPage() {
  const academicYears = await getAcademicYears();

  // Ensuring top summary card can show real data by utilizing prisma if extra stats are needed
  const activeTermCount = await prisma.academicTerm.count({
    where: { tenantId: DEFAULT_TENANT_ID, isActiveTerm: true }
  });

  return <CalendarClient academicYears={academicYears} />;
}