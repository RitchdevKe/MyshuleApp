import React from "react";
import ChannelsClient from "./ChannelsClient";
import { getCommunicationSettings } from "@/app/actions/communicationSettings";

export default async function ChannelsPage() {
  const settings = await getCommunicationSettings();

  return <ChannelsClient settings={settings} />;
}
