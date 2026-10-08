import React from "react";
import IntegrationsClient from "./IntegrationsClient";
import { getPaymentGateways } from "./actions";

export default async function IntegrationsPage() {
  const paymentGateways = await getPaymentGateways();
  
  return <IntegrationsClient paymentGateways={paymentGateways} />;
}

