import React from "react";
import AuditClient from "./AuditClient";
import { getSecurityAuditLogs } from "@/app/actions/security";

export default async function AuditPage() {
  const logs = await getSecurityAuditLogs();
  return <AuditClient initialLogs={logs} />;
}
