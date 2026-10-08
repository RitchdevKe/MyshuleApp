import React from "react";
import InspectionsClient from "./InspectionsClient";
import { getInspections, getFacilities } from "./actions";

// Use a default tenant ID for now, or fetch from auth context
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export default async function InspectionsPage() {
  const [inspections, facilities] = await Promise.all([
    getInspections(DEFAULT_TENANT_ID),
    getFacilities(DEFAULT_TENANT_ID),
  ]);

  return (
    <InspectionsClient 
      inspections={inspections} 
      facilities={facilities} 
      tenantId={DEFAULT_TENANT_ID} 
    />
  );
}
