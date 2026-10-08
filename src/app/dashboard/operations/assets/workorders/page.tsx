import React from "react";
import WorkOrdersClient from "./WorkOrdersClient";
import { getWorkOrders, getFacilities, getAssets } from "./actions";

export default async function WorkOrdersPage() {
  const workOrders = await getWorkOrders();
  const facilities = await getFacilities();
  const assets = await getAssets();

  return (
    <WorkOrdersClient
      initialWorkOrders={workOrders}
      facilities={facilities}
      assets={assets}
    />
  );
}
