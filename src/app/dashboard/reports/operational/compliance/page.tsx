import React from "react";
import ComplianceClient from "./ComplianceClient";
import { getComplianceReportData } from "./actions";

export const dynamic = "force-dynamic";

export default async function CompliancePage(props: { searchParams?: Promise<any> | any }) {
  const searchParams = await props.searchParams;
  const data = await getComplianceReportData(searchParams || {});

  return <ComplianceClient initialData={data} />;
}
