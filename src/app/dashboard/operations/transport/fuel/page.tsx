import React from "react";
import FuelClient from "./FuelClient";
import { getFuelRecords, getFuelStats, getVehicles } from "./actions";

export default async function FuelPage() {
  const records = await getFuelRecords();
  const stats = await getFuelStats();
  const vehicles = await getVehicles();

  return (
    <FuelClient
      records={records}
      stats={stats}
      vehicles={vehicles}
    />
  );
}
