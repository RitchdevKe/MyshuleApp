import React from "react";
import CenterClient from "./CenterClient";
import { getRecentSessions } from "@/app/actions/security";
import { getCenterSecurityOverview } from "@/app/actions/security_auth_center";

export default async function CenterPage() {
  const overview = await getCenterSecurityOverview();
  const sessions = await getRecentSessions();

  return <CenterClient overview={overview} sessions={sessions} />;
}
