import React from "react";
import InvoicesClient from "./InvoicesClient";
import { getInvoices } from "@/app/actions/billing";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <InvoicesClient invoices={invoices} />;
}
