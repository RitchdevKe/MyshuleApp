import React from "react";
import TeachersClient from "./TeachersClient";
import { getTeachersReportData } from "./actions";

export default async function AcademicTeachersTab() {
  const data = await getTeachersReportData();
  
  return <TeachersClient data={data} />;
}
