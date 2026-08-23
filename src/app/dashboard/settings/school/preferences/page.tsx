import React from "react";
import PreferencesClient from "./PreferencesClient";
import { getTenantProfile } from "@/app/actions/tenant";

export default async function PreferencesPage() {
  const tenant = await getTenantProfile();

  return <PreferencesClient tenant={tenant} />;
}
