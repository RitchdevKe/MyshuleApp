import React from "react";
import OverviewClient from "./OverviewClient";
import { getFinancialOverviewData, getOverviewFilterOptions } from "./actions";

export const dynamic = "force-dynamic";

export default async function FinancialOverviewPage() {
  const [data, filterOptions] = await Promise.all([
    getFinancialOverviewData(),
    getOverviewFilterOptions(),
  ]);

  return <OverviewClient initialData={data} filterOptions={filterOptions} />;
}
