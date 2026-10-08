import React from "react";
import AttendanceClient from "./AttendanceClient";
import { getAttendanceReportData } from "./actions";

export default async function AcademicAttendanceTab() {
  const data = await getAttendanceReportData();
  
  return <AttendanceClient initialData={data} />;
}
