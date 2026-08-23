import React from "react";
import { getBenefits } from "./actions";
import BenefitsClient from "./BenefitsClient";

export const dynamic = "force-dynamic";

export default async function BenefitsPage() {
  const tenantId = "T-001"; // To be retrieved from auth
  
  const initialBenefits = await getBenefits(tenantId);
  
  return (
    <BenefitsClient tenantId={tenantId} initialBenefits={initialBenefits} />
  );
}
