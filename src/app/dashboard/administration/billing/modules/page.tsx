import React from "react";
import ModulesClient from "./ModulesClient";
import { getModuleSubscriptions } from "@/app/actions/billing";

export default async function ModulesPage() {
  const { allModules, subscriptions } = await getModuleSubscriptions();
  return <ModulesClient allModules={allModules} subscriptions={subscriptions} />;
}
