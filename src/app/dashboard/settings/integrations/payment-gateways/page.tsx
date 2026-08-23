import React from "react";
import PaymentGatewaysClient from "./PaymentGatewaysClient";
import { getPaymentGateways } from "@/app/actions/finance";

export default async function PaymentGatewaysPage() {
  const gateways = await getPaymentGateways();

  return <PaymentGatewaysClient gateways={gateways} />;
}
