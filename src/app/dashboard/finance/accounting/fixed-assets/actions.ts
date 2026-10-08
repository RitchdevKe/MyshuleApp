"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerAsset(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const purchaseCost = parseFloat(formData.get("purchaseCost") as string);
  const assetTag = formData.get("assetTag") as string;
  const status = formData.get("status") as string || "ACTIVE";
  
  if (!name || !category || isNaN(purchaseCost) || !assetTag) {
    throw new Error("Missing required fields");
  }

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.asset.create({
    data: {
      tenantId: tenant.id,
      name,
      category,
      purchaseCost,
      assetTag,
      status,
      condition: "GOOD",
    },
  });

  revalidatePath("/dashboard/finance/accounting/fixed-assets");
}
