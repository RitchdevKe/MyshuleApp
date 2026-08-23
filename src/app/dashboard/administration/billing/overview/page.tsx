import React from "react";
import OverviewClient from "./OverviewClient";
import { getBillingOverview } from "@/app/actions/billing";

export default async function OverviewPage() {
  const { subscriptions, studentCount, totalModulesCount, tenant } = await getBillingOverview();
  
  return (
    <OverviewClient 
      subscriptions={subscriptions} 
      studentCount={studentCount} 
      totalModulesCount={totalModulesCount} 
      tenant={tenant}
    />
  );
}
