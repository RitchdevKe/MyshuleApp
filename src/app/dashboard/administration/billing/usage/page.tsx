import React from "react";
import UsageClient from "./UsageClient";
import { getUsageStats } from "@/app/actions/billing";

export default async function UsagePage() {
  const stats = await getUsageStats();
  return <UsageClient stats={stats} />;
}
