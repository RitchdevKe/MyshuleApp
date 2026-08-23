import React from "react";
import SessionsClient from "./SessionsClient";
import { getRecentSessions } from "@/app/actions/security";

export default async function SessionsPage() {
  const sessions = await getRecentSessions();
  return <SessionsClient initialSessions={sessions} />;
}
