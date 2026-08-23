import React from "react";
import TemplatesClient from "./TemplatesClient";
import { getMessageTemplates } from "@/app/actions/communicationSettings";

export default async function TemplatesPage() {
  const templates = await getMessageTemplates();

  return <TemplatesClient templates={templates} />;
}
