import React from "react";
import ExaminationsClient from "./ExaminationsClient";
import { getAcademicSettings } from "@/app/actions/academicSettings";

export default async function ExaminationsPage() {
  const settings = await getAcademicSettings();

  return <ExaminationsClient settings={settings} />;
}
