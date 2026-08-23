import React from "react";
import TriggersClient from "./TriggersClient";
import { getCommunicationTriggers, seedTriggersIfEmpty, getMessageTemplates } from "@/app/actions/communicationSettings";

export default async function TriggersPage() {
  await seedTriggersIfEmpty();
  const triggers = await getCommunicationTriggers();
  const templates = await getMessageTemplates();

  return <TriggersClient triggers={triggers} templates={templates} />;
}
