import React from "react";
import { getAIReportData } from "./actions";
import AIReportClient from "./AIReportClient";

export const dynamic = "force-dynamic";

export default async function AIReportPage() {
  const data = await getAIReportData();
  
  return <AIReportClient data={data} />;
}
