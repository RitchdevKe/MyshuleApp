import React from "react";
import PayrollSummaryClient from "./PayrollSummaryClient";
import { getPayrollSummaryData } from "./actions";

export default async function PayrollSummaryPage() {
  const data = await getPayrollSummaryData();

  return <PayrollSummaryClient data={data} />;
}
