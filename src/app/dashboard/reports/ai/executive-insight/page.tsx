import ExecutiveInsightClient from "./ExecutiveInsightClient";
import { getExecutiveInsightSummary } from "./actions";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ExecutiveInsightPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  
  const initialData = await getExecutiveInsightSummary();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Executive Insight
        </h2>
      </div>
      <ExecutiveInsightClient initialData={initialData} />
    </div>
  );
}
