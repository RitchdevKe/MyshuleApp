import React from "react";
import PaymentMethodsClient from "./PaymentMethodsClient";
import { getPaymentMethods } from "@/app/actions/subscription";

export default async function PaymentMethodsPage() {
  const methods = await getPaymentMethods();
  return <PaymentMethodsClient initialMethods={methods} />;
}
