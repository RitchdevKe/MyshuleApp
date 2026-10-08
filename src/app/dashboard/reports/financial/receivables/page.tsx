import React from "react";
import { getReceivablesReport } from "./actions";
import ReceivablesClient from "./receivables-client";

export const dynamic = "force-dynamic";

export default async function ReceivablesPage() {
  const initialData = await getReceivablesReport();

  return <ReceivablesClient initialData={initialData} />;
}
