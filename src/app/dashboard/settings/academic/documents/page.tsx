import React from "react";
import DocumentsClient from "./DocumentsClient";
import { getDocumentTemplates } from "@/app/actions/documentTemplates";

export default async function DocumentsPage() {
  const templates = await getDocumentTemplates();

  return <DocumentsClient templates={templates} />;
}
