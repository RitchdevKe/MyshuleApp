import React from "react";
import BranchesClient from "./BranchesClient";
import { getTenantProfile } from "@/app/actions/tenant";

export default async function BranchesPage() {
  const profile = await getTenantProfile();
  const branches = profile?.branches || [];

  return <BranchesClient branches={branches} />;
}
