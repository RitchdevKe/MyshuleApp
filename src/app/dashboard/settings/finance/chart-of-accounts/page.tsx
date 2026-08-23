import React from "react";
import ChartOfAccountsClient from "./ChartOfAccountsClient";
import { getChartOfAccounts } from "@/app/actions/chartOfAccounts";

export default async function ChartOfAccountsPage() {
  const accounts = await getChartOfAccounts();

  return <ChartOfAccountsClient accounts={accounts} />;
}
