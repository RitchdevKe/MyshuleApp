import { getPolicies } from "@/app/actions/rolesAndPermissions";
import PoliciesClient from "./PoliciesClient";

export default async function PoliciesPage() {
  const policies = await getPolicies();
  return <PoliciesClient initialPolicies={policies} />;
}
