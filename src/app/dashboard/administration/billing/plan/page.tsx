import React from "react";
import PlanClient from "./PlanClient";
import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export default async function PlanPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { id: DEFAULT_TENANT_ID }
  });
  
  return <PlanClient tenant={tenant} />;
}
