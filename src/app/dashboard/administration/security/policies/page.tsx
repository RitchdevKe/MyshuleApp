import React from "react";
import PoliciesClient from "./PoliciesClient";
import { getExtendedPoliciesConfig } from "@/app/actions/security_policies_audit";

export default async function PoliciesPage() {
  const config = await getExtendedPoliciesConfig();
  return <PoliciesClient initialConfig={config} />;
}
