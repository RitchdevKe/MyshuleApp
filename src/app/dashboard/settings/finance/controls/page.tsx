import React from "react";
import ControlsClient from "./ControlsClient";
import { getFinanceSettings } from "@/app/actions/financeSettings";

export default async function FinanceControlsPage() {
  const settings = await getFinanceSettings();

  return <ControlsClient settings={settings} />;
}
