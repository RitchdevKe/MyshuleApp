"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAssets(tenantId: string) {
  return await prisma.asset.findMany({
    where: { tenantId },
    include: { facility: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAssetStats(tenantId: string) {
  const [totalAssets, maintenanceAssets, valueAgg] = await Promise.all([
    prisma.asset.count({ where: { tenantId } }),
    prisma.asset.count({ where: { tenantId, status: "MAINTENANCE" } }),
    prisma.asset.aggregate({
      _sum: { purchaseCost: true },
      where: { tenantId },
    }),
  ]);

  return {
    totalAssets,
    assetsInMaintenance: maintenanceAssets,
    totalValue: valueAgg._sum.purchaseCost || 0,
  };
}

export async function createAsset(data: {
  tenantId: string;
  name: string;
  assetTag: string;
  category: string;
  status: string;
  condition: string;
  purchaseCost?: number;
  facilityId?: string;
}) {
  const asset = await prisma.asset.create({
    data,
  });
  revalidatePath("/dashboard/operations/assets/register");
  return asset;
}

export async function updateAsset(
  id: string,
  data: {
    name?: string;
    assetTag?: string;
    category?: string;
    status?: string;
    condition?: string;
    purchaseCost?: number;
    facilityId?: string;
  }
) {
  const asset = await prisma.asset.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/operations/assets/register");
  return asset;
}

export async function deleteAsset(id: string) {
  await prisma.asset.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/assets/register");
}
