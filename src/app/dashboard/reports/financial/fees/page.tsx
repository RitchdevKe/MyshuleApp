import React from "react";
import FeesClient from "./FeesClient";
import { getFeeReportData, getFeeFilterOptions } from "./actions";

export const dynamic = "force-dynamic";

export default async function FeesReportPage() {
  const [initialData, filterOptions] = await Promise.all([
    getFeeReportData(),
    getFeeFilterOptions(),
  ]);

  return <FeesClient initialData={initialData} filterOptions={filterOptions} />;
}
