import React from "react";
import UpgradesClient from "./UpgradesClient";
import { getAvailablePlans } from "@/app/actions/subscription";
import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export default async function UpgradesPage() {
  const plans = await getAvailablePlans();
  const tenant = await prisma.tenant.findUnique({
    where: { id: DEFAULT_TENANT_ID }
  });
  return <UpgradesClient plans={plans} currentPlan={tenant?.subscriptionPlan || "Free"} />;
}
