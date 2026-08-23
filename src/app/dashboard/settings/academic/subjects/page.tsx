import React from "react";
import SubjectsClient from "./SubjectsClient";
import { getSubjects } from "@/app/actions/subjects";

export default async function SubjectsPage() {
  const subjects = await getSubjects();
  return <SubjectsClient subjects={subjects} />;
}
