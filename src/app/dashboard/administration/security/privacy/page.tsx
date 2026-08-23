import React from "react";
import PrivacyClient from "./PrivacyClient";
import { getPrivacyRequests } from "@/app/actions/security";

export default async function PrivacyPage() {
  const requests = await getPrivacyRequests();
  return <PrivacyClient initialRequests={requests} />;
}
