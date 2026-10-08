import React from "react";
import AssetRegisterClient from "./AssetRegisterClient";
import prisma from "@/lib/prisma";
import { getAssets, getAssetStats } from "./actions";

export default async function AssetRegisterPage() {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant?.id || "default";

  const [assets, stats, facilities] = await Promise.all([
    getAssets(tenantId),
    getAssetStats(tenantId),
    prisma.facility.findMany({ where: { tenantId } })
  ]);

  return (
    <AssetRegisterClient 
      initialAssets={assets} 
      stats={stats} 
      tenantId={tenantId}
      facilities={facilities}
    />
  );
}
