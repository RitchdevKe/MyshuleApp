import React from "react";
import { getInitialStatementsData } from "./actions";
import StatementsClient from "./StatementsClient";

export const dynamic = "force-dynamic";

export default async function FinancialStatementsPage() {
  const { students, initialStudentStatement, institutionalReport } =
    await getInitialStatementsData();

  return (
    <StatementsClient
      students={students}
      initialStudentStatement={initialStudentStatement}
      institutionalReport={institutionalReport}
    />
  );
}
