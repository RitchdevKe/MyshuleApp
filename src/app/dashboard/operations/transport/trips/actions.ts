"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getTrips() {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  return await prisma.trip.findMany({
    where: { tenantId: session.tenantId },
    include: {
      route: true,
      vehicle: true,
      driver: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function createTrip(data: {
  routeId: string;
  vehicleId: string;
  driverId?: string;
  date: Date;
  status: string;
  notes?: string;
}) {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const trip = await prisma.trip.create({
    data: {
      ...data,
      tenantId: session.tenantId,
    },
  });
  revalidatePath("/dashboard/operations/transport/trips");
  return trip;
}

export async function updateTripStatus(tripId: string, status: string) {
  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: { status },
  });
  revalidatePath("/dashboard/operations/transport/trips");
  return trip;
}
