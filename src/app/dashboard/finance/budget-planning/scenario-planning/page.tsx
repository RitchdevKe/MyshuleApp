import prisma from "@/lib/prisma";
import ScenarioClient from "./client";

export default async function ScenarioPlanningPage() {
  const budget = await prisma.budget.findFirst({
    include: {
      scenarios: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!budget) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mt-6">
        <h2 className="text-xl font-bold text-slate-800">No active budget found</h2>
        <p className="text-slate-500 mt-2">Please ensure a budget is created before planning scenarios.</p>
      </div>
    );
  }

  // Base mock for values if not present
  const baseBudget = budget.totalAmount || 150000000;
  // Let's assume some base revenue mock based on the budget
  const baseRevenue = baseBudget * 1.053; 

  return (
    <ScenarioClient
      budget={budget}
      baseBudget={baseBudget}
      baseRevenue={baseRevenue}
      scenarios={budget.scenarios}
    />
  );
}
