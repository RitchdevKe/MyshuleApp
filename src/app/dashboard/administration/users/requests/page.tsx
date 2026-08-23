import React from "react";
import RequestsClient from "./RequestsClient";
import { getAccessRequests } from "@/app/actions/userManagement";

export default async function AccessRequestsPage() {
  const requests = await getAccessRequests();
  return <RequestsClient initialRequests={requests} />;
}
