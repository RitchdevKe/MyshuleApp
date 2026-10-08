import React from "react";
import TemplatesClient from "./TemplatesClient";
import { getTemplates } from "./actions";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="p-6 h-full">
      <TemplatesClient initialTemplates={templates} />
    </div>
  );
}
