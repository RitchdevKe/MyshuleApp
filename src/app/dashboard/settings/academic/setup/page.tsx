import React from "react";
import { getAcademicYears, getGradingScales } from "@/app/actions/academic";
import AcademicClient from "./AcademicClient";

export default async function AcademicPage() {
  const [years, gradingScales] = await Promise.all([
    getAcademicYears(),
    getGradingScales(),
  ]);

  return <AcademicClient years={years} gradingScales={gradingScales} />;
}
