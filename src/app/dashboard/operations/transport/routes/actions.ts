"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRoutes(tenantId: string) {
  return await prisma.transportRoute.findMany({
    where: { tenantId },
    include: {
      driver: true,
      assignments: true,
      trips: {
        orderBy: { date: 'desc' },
        take: 1
      }
    },
    orderBy: { routeName: "asc" },
  });
}

export async function createRoute(data: {
  tenantId: string;
  routeName: string;
  driverId?: string;
  vehiclePlate?: string;
  costPerTerm?: number;
}) {
  const route = await prisma.transportRoute.create({
    data,
  });
  revalidatePath("/dashboard/operations/transport/routes");
  return route;
}

export async function updateRoute(
  routeId: string,
  data: {
    routeName?: string;
    driverId?: string;
    vehiclePlate?: string;
    costPerTerm?: number;
  }
) {
  const route = await prisma.transportRoute.update({
    where: { id: routeId },
    data,
  });
  revalidatePath("/dashboard/operations/transport/routes");
  return route;
}

export async function deleteRoute(routeId: string) {
  await prisma.transportRoute.delete({
    where: { id: routeId },
  });
  revalidatePath("/dashboard/operations/transport/routes");
}
