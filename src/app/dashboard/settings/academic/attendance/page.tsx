import React from "react";
import AttendanceClient from "./AttendanceClient";
import { getAcademicSettings } from "@/app/actions/academicSettings";

export default async function AttendancePage() {
  const settings = await getAcademicSettings();

  return <AttendanceClient settings={settings} />;
}
