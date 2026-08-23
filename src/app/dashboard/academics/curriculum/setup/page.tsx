import React from "react";
import SetupClient from "./SetupClient";
import { getExams, getAcademicTerms } from "@/app/actions/curriculum";

export default async function SetupPage() {
  const [exams, academicTerms] = await Promise.all([
    getExams(),
    getAcademicTerms()
  ]);

  return <SetupClient initialExams={exams} academicTerms={academicTerms} />;
}
