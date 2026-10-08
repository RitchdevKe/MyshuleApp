import React from "react";
import prisma from "@/lib/prisma";
import { getTenantProfile } from "@/app/actions/tenant";
import FinancialYearClient from "./FinancialYearClient";

export default async function FinancialYearPage() {
  const tenant = await getTenantProfile();
  
  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  const financialYears = await prisma.financialYear.findMany({
    where: { tenantId: tenant.id },
    orderBy: { startDate: "desc" },
  });

  return <FinancialYearClient tenantId={tenant.id} financialYears={financialYears} />;
}
