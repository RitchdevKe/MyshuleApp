import React from "react";
import { getTenantProfile } from "@/app/actions/tenant";
import { getCommunicationSettings } from "@/app/actions/communicationSettings";
import ConfigurationClient from "./ConfigurationClient";

export default async function ConfigurationPage() {
  const tenant = await getTenantProfile();
  const commSettings = await getCommunicationSettings();
  
  return <ConfigurationClient tenant={tenant} commSettings={commSettings} />;
}
