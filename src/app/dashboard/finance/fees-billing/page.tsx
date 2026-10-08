"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeesBillingPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/finance/fees-billing/student-accounts");
  }, [router]);
  
  return null;
}
