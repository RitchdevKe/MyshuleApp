import React from "react";
import ActivityClient from "./ActivityClient";
import { getActivityLogs } from "@/app/actions/userManagement";

export default async function ActivityPage() {
  const activities = await getActivityLogs();
  return <ActivityClient initialActivities={activities} />;
}
