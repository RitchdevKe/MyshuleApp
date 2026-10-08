"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createStockMovement(data: {
  movementType: "IN" | "OUT" | "TRANSFER";
  itemId: string;
  quantity: number;
  sourceStoreId?: string | null;
  destinationStoreId?: string | null;
  reference?: string;
  notes?: string;
}) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }

  const { tenantId } = session;

  return await prisma.$transaction(async (tx) => {
    // 1. Create the movement
    const movement = await tx.stockMovement.create({
      data: {
        tenantId,
        movementType: data.movementType,
        itemId: data.itemId,
        quantity: data.quantity,
        sourceStoreId: data.sourceStoreId,
        destinationStoreId: data.destinationStoreId,
        reference: data.reference,
        notes: data.notes,
      },
    });

    // 2. Update balances
    if (data.movementType === "IN" && data.destinationStoreId) {
      await tx.inventoryBalance.upsert({
        where: {
          storeId_itemId: {
            storeId: data.destinationStoreId,
            itemId: data.itemId,
          },
        },
        create: {
          tenantId,
          storeId: data.destinationStoreId,
          itemId: data.itemId,
          quantity: data.quantity,
        },
        update: {
          quantity: {
            increment: data.quantity,
          },
        },
      });
    } else if (data.movementType === "OUT" && data.sourceStoreId) {
      await tx.inventoryBalance.upsert({
        where: {
          storeId_itemId: {
            storeId: data.sourceStoreId,
            itemId: data.itemId,
          },
        },
        create: {
          tenantId,
          storeId: data.sourceStoreId,
          itemId: data.itemId,
          quantity: -data.quantity,
        },
        update: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });
    } else if (data.movementType === "TRANSFER" && data.sourceStoreId && data.destinationStoreId) {
      // decrement source
      await tx.inventoryBalance.upsert({
        where: {
          storeId_itemId: {
            storeId: data.sourceStoreId,
            itemId: data.itemId,
          },
        },
        create: {
          tenantId,
          storeId: data.sourceStoreId,
          itemId: data.itemId,
          quantity: -data.quantity,
        },
        update: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });

      // increment destination
      await tx.inventoryBalance.upsert({
        where: {
          storeId_itemId: {
            storeId: data.destinationStoreId,
            itemId: data.itemId,
          },
        },
        create: {
          tenantId,
          storeId: data.destinationStoreId,
          itemId: data.itemId,
          quantity: data.quantity,
        },
        update: {
          quantity: {
            increment: data.quantity,
          },
        },
      });
    }

    revalidatePath("/dashboard/operations/inventory/movements");
    revalidatePath("/dashboard/operations/inventory/overview");
    revalidatePath("/dashboard/operations/inventory/items");
    revalidatePath("/dashboard/operations/inventory/stores");
    return movement;
  });
}
