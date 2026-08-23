import React from "react";
import DeductionsClient from "./DeductionsClient";
import { getDeductions } from "./actions";

export default async function DeductionsPage() {
  const deductions = await getDeductions();

  return <DeductionsClient initialDeductions={deductions} />;
}
