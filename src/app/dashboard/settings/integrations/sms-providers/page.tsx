import React from "react";
import SMSProvidersClient from "./SMSProvidersClient";
import { getCommunicationSettings } from "@/app/actions/communicationSettings";

export default async function SMSProvidersPage() {
  const settings = await getCommunicationSettings();

  return <SMSProvidersClient settings={settings} />;
}
