import React from "react";
import { getOperationalOverviewData } from "./actions";
import OverviewClient from "./OverviewClient";

export const dynamic = "force-dynamic";

export default async function OperationalOverviewTab({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const branchId = typeof searchParams.branchId === "string" ? searchParams.branchId : undefined;
  const dateRange = typeof searchParams.dateRange === "string" ? searchParams.dateRange : undefined;

  const overviewData = await getOperationalOverviewData({ branchId, dateRange });

  return <OverviewClient initialData={overviewData} />;
}
