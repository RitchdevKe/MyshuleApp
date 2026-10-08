import React from "react";
import BudgetsClient from "./BudgetsClient";
import { getBudgetsReportData } from "./actions";

export const dynamic = "force-dynamic";

export default async function BudgetsPage() {
  const data = await getBudgetsReportData();

  return <BudgetsClient initialData={data} />;
}
