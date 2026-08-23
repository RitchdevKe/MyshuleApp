import React from "react";
import ClientPage from "./ClientPage";
import { getCommunicationLogs, getMessageTemplates, getRecipients } from "@/app/actions/communicationLogs";

export default async function CommunicationServerPage() {
  const logs = await getCommunicationLogs();
  const templates = await getMessageTemplates();
  const recipients = await getRecipients();

  return (
    <ClientPage 
      logs={logs} 
      templates={templates} 
      recipients={recipients} 
    />
  );
}
