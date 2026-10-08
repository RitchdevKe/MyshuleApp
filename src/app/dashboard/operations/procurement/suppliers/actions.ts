"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
  const tenantId = "tenant-1";
  return prisma.supplier.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      purchaseOrders: true,
    }
  });
}

export async function createSupplier(data: {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}) {
  const tenantId = "tenant-1";
  await prisma.supplier.create({
    data: {
      tenantId,
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status || "ACTIVE",
    },
  });
  revalidatePath("/dashboard/operations/procurement/suppliers");
}

export async function updateSupplier(id: string, data: {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}) {
  await prisma.supplier.update({
    where: { id },
    data: {
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status,
    },
  });
  revalidatePath("/dashboard/operations/procurement/suppliers");
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/procurement/suppliers");
}
