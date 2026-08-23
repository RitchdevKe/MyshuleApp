import React from "react";
import BillingHistoryClient from "./BillingHistoryClient";
import { getBillingHistory } from "@/app/actions/subscription";

export default async function BillingHistoryPage() {
  const invoices = await getBillingHistory();
  return <BillingHistoryClient initialInvoices={invoices} />;
}
