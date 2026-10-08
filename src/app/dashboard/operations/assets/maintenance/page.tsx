import React from "react";
import MaintenanceClient from "./MaintenanceClient";
import { getMaintenanceRecords, getAssets } from "./actions";

export default async function MaintenancePage() {
  const records = await getMaintenanceRecords();
  const assets = await getAssets();

  return <MaintenanceClient records={records} assets={assets} />;
}

