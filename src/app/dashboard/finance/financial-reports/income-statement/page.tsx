import React from "react";
import IncomeStatementClient from "./IncomeStatementClient";
import { getIncomeStatementData } from "./actions";

export default async function IncomeStatementPage({
  searchParams,
}: {
  searchParams: Promise<{ yearId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const yearId = resolvedParams?.yearId;
  const data = await getIncomeStatementData(yearId);

  return <IncomeStatementClient data={data} />;
}
