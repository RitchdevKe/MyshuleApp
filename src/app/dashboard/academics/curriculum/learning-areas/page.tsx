import React from "react";
import LearningAreasClient from "./LearningAreasClient";
import { getSubjects } from "@/app/actions/subjects";

export default async function LearningAreasPage() {
  const subjects = await getSubjects();

  return (
    <LearningAreasClient subjects={subjects} />
  );
}