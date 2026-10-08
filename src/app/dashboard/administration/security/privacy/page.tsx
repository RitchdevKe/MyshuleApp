import React from "react";
import PrivacyClient from "./PrivacyClient";
import { getPrivacyRequests } from "@/app/actions/security";
import { getPrivacySettings } from "@/app/actions/security_privacy_sessions";

export default async function PrivacyPage() {
  const requests = await getPrivacyRequests();
  const settings = await getPrivacySettings();
  return <PrivacyClient initialRequests={requests} initialSettings={settings} />;
}
