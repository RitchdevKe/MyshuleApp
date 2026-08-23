import React from "react";
import { getAcademicYears } from "@/app/actions/academic";
import CalendarClient from "./CalendarClient";

export default async function AcademicCalendarPage() {
  const years = await getAcademicYears();
  
  return <CalendarClient initialYears={years} />;
}
