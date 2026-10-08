"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FinancialReportsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/finance/financial-reports/income-statement");
  }, [router]);
  
  return null;
}
