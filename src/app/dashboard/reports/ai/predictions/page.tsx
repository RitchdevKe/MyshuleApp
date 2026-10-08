import { getPredictions } from "./actions";
import PredictionsClient from "./PredictionsClient";
// Assuming you have a way to get tenantId, e.g., from auth/cookies, but for simplicity here we might need to fetch a default or mock tenantId if it's not provided by layout.
// I will just fetch the first tenant to make it work, as auth is usually outside the scope of the specific component unless specified.
import prisma from "@/lib/prisma";

export const metadata = {
  title: "AI Predictions - Reports",
};

export default async function PredictionsPage() {
  const firstTenant = await prisma.tenant.findFirst();
  const tenantId = firstTenant?.id || "";

  const predictionsData = await getPredictions(tenantId);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">AI Predictions</h2>
          <p className="text-slate-400">
            Predictive analytics for academics and financials.
          </p>
        </div>
      </div>
      <PredictionsClient initialData={predictionsData} />
    </div>
  );
}
