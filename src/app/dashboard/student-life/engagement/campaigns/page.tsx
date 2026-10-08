import React from "react";
import prisma from "@/lib/prisma";
import EngagementClient from "./EngagementClient";
import { getCampaigns, getEvents, getSurveys } from "./actions";

export default async function EngagementPage() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    return <div className="p-6">No tenant found. Please set up a tenant first.</div>;
  }

  const [campaigns, events, surveys] = await Promise.all([
    getCampaigns(tenant.id),
    getEvents(tenant.id),
    getSurveys(tenant.id)
  ]);

  return (
    <EngagementClient 
      initialCampaigns={campaigns} 
      initialEvents={events} 
      initialSurveys={surveys}
      tenantId={tenant.id} 
    />
  );
}