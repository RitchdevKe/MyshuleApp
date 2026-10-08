import React from "react";
import OperationsClient from "./OperationsClient";
import { getOperationalReportData, getOperationalFilterOptions } from "./actions";

export const dynamic = "force-dynamic";

export default async function OperationsReportPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const branchId = typeof searchParams.branchId === "string" ? searchParams.branchId : undefined;
  
  const [data, filterOptions] = await Promise.all([
    getOperationalReportData({ branchId }),
    getOperationalFilterOptions(),
  ]);

  return <OperationsClient initialData={data} filterOptions={filterOptions} initialBranchId={branchId} />;
}
