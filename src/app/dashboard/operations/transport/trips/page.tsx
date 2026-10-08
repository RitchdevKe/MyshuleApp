import React from "react";
import { getTrips } from "./actions";
import TripsClient from "./TripsClient";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Trips - Transport Operations",
};

export default async function TripsPage() {
  const session = await getSession();
  if (!session?.tenantId) return null;

  const trips = await getTrips();
  const routes = await prisma.transportRoute.findMany({ where: { tenantId: session.tenantId } });
  const vehicles = await prisma.vehicle.findMany({ where: { tenantId: session.tenantId, status: "ACTIVE" } });
  const drivers = await prisma.staff.findMany({ where: { tenantId: session.tenantId } }); // Simplification for now

  return <TripsClient initialTrips={trips} routes={routes} vehicles={vehicles} drivers={drivers} />;
}
