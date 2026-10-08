import React from "react";
import { getSession } from "@/lib/auth";
import { getFacilities } from "./actions";
import FacilitiesClient from "./FacilitiesClient";

export default async function FacilitiesPage() {
  const session = await getSession();
  const tenantId = session?.tenantId || "default";

  const initialFacilities = await getFacilities(tenantId);

  return (
    <FacilitiesClient
      tenantId={tenantId}
      facilities={initialFacilities}
    />
  );
}
