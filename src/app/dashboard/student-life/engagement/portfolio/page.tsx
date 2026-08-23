import React from "react";
import PortfolioManager from "./PortfolioManager";
import { getStudents } from "./actions";

export default async function EngagementPortfolioPage() {
  const students = await getStudents();

  return (
    <PortfolioManager students={students} />
  );
}
