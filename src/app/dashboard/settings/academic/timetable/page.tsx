import React from "react";
import TimetableClient from "./TimetableClient";
import { getAcademicSettings } from "@/app/actions/academicSettings";

export default async function TimetablePage() {
  const settings = await getAcademicSettings();

  return <TimetableClient settings={settings} />;
}
