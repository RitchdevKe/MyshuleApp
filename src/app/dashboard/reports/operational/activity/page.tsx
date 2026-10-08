import React from "react";
import ActivityClient from "./ActivityClient";
import { getActivityReportData } from "./actions";

export const dynamic = "force-dynamic";

export default async function OperationalActivityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await getActivityReportData();
  
  const searchParamsDict = {
    searchTerm: typeof searchParams.searchTerm === "string" ? searchParams.searchTerm : undefined,
    channel: typeof searchParams.channel === "string" ? searchParams.channel : undefined,
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    timeRange: typeof searchParams.timeRange === "string" ? searchParams.timeRange : undefined,
  };

  return <ActivityClient initialData={data} searchParams={searchParamsDict} />;
}
