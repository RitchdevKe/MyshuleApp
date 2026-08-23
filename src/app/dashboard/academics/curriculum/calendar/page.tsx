import React from "react";
import CalendarClient from "./calendar-client";
import { getAcademicYears } from "@/app/actions/academic";

export const metadata = {
  title: "Calendar | Curriculum",
};

export default async function CalendarPage() {
  const academicYears = await getAcademicYears();

  return (
    <CalendarClient academicYears={academicYears} />
  );
}