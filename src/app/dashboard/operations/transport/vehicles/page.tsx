import { getVehicles, getVehicleStats } from "./actions";
import VehiclesClient from "./VehiclesClient";

export default async function VehiclesPage() {
  const [vehicles, stats] = await Promise.all([
    getVehicles(),
    getVehicleStats()
  ]);

  return <VehiclesClient initialVehicles={vehicles} initialStats={stats} />;
}
