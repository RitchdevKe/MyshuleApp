import React from "react";
import { getStudents } from "./actions";
import AwardsClient from "./AwardsClient";

export default async function EngagementAwardsPage() {
  const students = await getStudents();

  return (
    <AwardsClient students={students} />
  );
}
