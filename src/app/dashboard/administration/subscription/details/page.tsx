import React from "react";
import DetailsClient from "./DetailsClient";
import { getSubscriptionDetails } from "@/app/actions/subscription";

export default async function DetailsPage() {
  const tenant = await getSubscriptionDetails();
  
  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return <DetailsClient tenant={tenant} />;
}
