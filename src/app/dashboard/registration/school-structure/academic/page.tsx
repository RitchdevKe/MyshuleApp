import React from "react";
import { getAcademicYears } from "@/app/actions/academic";
import AcademicClient from "./AcademicClient";

export default async function AcademicPage() {
  const academicYears = await getAcademicYears();

  return <AcademicClient academicYears={academicYears} />;
}