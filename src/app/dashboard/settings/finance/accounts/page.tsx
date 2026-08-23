import React from "react";
import AccountsClient from "./AccountsClient";
import { getBankAccounts, getPaymentGateways } from "@/app/actions/finance";

export default async function AccountsPage() {
  const bankAccounts = await getBankAccounts();
  const paymentGateways = await getPaymentGateways();

  return <AccountsClient bankAccounts={bankAccounts} paymentGateways={paymentGateways} />;
}
