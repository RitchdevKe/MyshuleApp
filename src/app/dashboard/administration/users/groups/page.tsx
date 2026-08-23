import React from "react";
import GroupsClient from "./GroupsClient";
import { getGroups } from "@/app/actions/userManagement";

export default async function GroupsPage() {
  const groups = await getGroups();
  return <GroupsClient initialGroups={groups} />;
}
