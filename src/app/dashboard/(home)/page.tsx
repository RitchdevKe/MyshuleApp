import { getDashboardOverview } from "./actions";
import OverviewClient from "./OverviewClient";

export default async function DashboardPage() {
  const data = await getDashboardOverview("All");
  
  return <OverviewClient initialData={data} />;
}
