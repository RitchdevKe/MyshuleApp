import React from "react";
import RemedialClient from "./RemedialClient";
import { getAcademicSettings } from "@/app/actions/academicSettings";

export default async function RemedialPage() {
  const settings = await getAcademicSettings();
  return <RemedialClient settings={settings} />;
}
