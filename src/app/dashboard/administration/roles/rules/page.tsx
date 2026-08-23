import { getRules } from "@/app/actions/rolesAndPermissions";
import RulesClient from "./RulesClient";

export default async function RulesPage() {
  const rules = await getRules();
  return <RulesClient initialRules={rules} />;
}
