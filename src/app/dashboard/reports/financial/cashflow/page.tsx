import React from "react";
import CashflowClient from "./CashflowClient";
import { getCashflowReportData, getFilterOptions } from "./actions";

export const dynamic = "force-dynamic";

export default async function CashflowPage() {
  const [initialData, filterOptions] = await Promise.all([
    getCashflowReportData(),
    getFilterOptions(),
  ]);

  return (
    <CashflowClient
      initialData={initialData}
      filterOptions={filterOptions}
    />
  );
}
