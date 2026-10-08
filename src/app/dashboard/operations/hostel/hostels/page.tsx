import React from "react";
import { getSession } from "@/lib/auth";
import { getHostels } from "./actions";
import HostelsClient from "./HostelsClient";

export const metadata = {
  title: "Hostels | School Management System",
};

export default async function HostelsPage() {
  const session = await getSession();
  const tenantId = session?.tenantId || "default";

  const initialHostels = await getHostels(tenantId);

  return (
    <HostelsClient
      tenantId={tenantId}
      initialHostels={initialHostels}
    />
  );
}
