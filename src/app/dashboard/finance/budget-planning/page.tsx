"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BudgetPlanningPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/finance/budget-planning/budget-overview");
  }, [router]);
  
  return null;
}
