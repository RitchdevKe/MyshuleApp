import React from "react";
import HardwareClient from "./HardwareClient";
import { getHardwareDevices } from "@/app/actions/integrations";

export default async function HardwarePage() {
  const devices = await getHardwareDevices();

  return <HardwareClient devices={devices} />;
}
