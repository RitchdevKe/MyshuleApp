import { getRecommendations } from "./actions";
import RecommendationsClient from "./RecommendationsClient";

export const metadata = {
  title: "AI Recommendations - Reports",
};

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">AI Recommendations</h2>
          <p className="text-slate-400 text-sm mt-1">
            Data-driven actionable insights for your institution.
          </p>
        </div>
      </div>
      
      <RecommendationsClient initialRecommendations={recommendations} />
    </div>
  );
}
