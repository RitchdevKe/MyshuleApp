import React from "react";
import RouteClient from "./RouteClient";
import { getRoutes } from "./actions";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function RoutesPage() {
  const session = await getSession();
  
  let tenantId = session?.tenantId;
  
  // For demo/dev if no session
  if (!tenantId) {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Default Demo Tenant",
          domainPrefix: "demo",
        }
      });
    }
    tenantId = tenant.id;
  }

  const routes = await getRoutes(tenantId);

  return (
    <RouteClient routes={routes} tenantId={tenantId} />
  );
}
