import React from "react";
import AuditClient from "./AuditClient";
import { getActivityLogs } from "@/app/actions/userManagement";

export default async function AuditPage() {
  const auditLogs = await getActivityLogs();
  return <AuditClient initialLogs={auditLogs} />;
}
