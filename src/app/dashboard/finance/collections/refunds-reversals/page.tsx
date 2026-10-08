import React from "react";
import RefundsClient from "./RefundsClient";
import { getRefunds, getPayments } from "./actions";

export default async function RefundsReversalsPage() {
  const refunds = await getRefunds();
  const payments = await getPayments();

  return (
    <div className="p-6">
      <RefundsClient refunds={refunds} payments={payments} />
    </div>
  );
}
