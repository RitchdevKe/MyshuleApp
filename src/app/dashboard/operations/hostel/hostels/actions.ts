"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHostels(tenantId: string) {
  return await prisma.hostel.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: {
          allocations: { where: { status: "ACTIVE" } }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createHostel(data: {
  tenantId: string;
  name: string;
  type: string;
  capacity: number;
  warden?: string;
  status: string;
}) {
  const hostel = await prisma.hostel.create({
    data,
  });
  revalidatePath("/dashboard/operations/hostel/hostels");
  return hostel;
}

export async function updateHostel(
  id: string,
  data: {
    name?: string;
    type?: string;
    capacity?: number;
    warden?: string;
    status?: string;
  }
) {
  const hostel = await prisma.hostel.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/operations/hostel/hostels");
  return hostel;
}

export async function deleteHostel(id: string) {
  await prisma.hostel.delete({
    where: { id },
  });
  revalidatePath("/dashboard/operations/hostel/hostels");
}
