import React from "react";
import { getAccountingReportData } from "./actions";
import AccountingReportsClient from "./AccountingReportsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accounting Reports | Green Valley Academy",
  description: "General Ledger, Chart of Accounts, and double-entry financial statements",
};

export default async function AccountingReportPage() {
  const data = await getAccountingReportData();

  return <AccountingReportsClient initialData={data} />;
}
