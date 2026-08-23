import React from "react";
import RolesClient from "./RolesClient";
import { getRoles } from "@/app/actions/staff";
import prisma from "@/lib/prisma";

export default async function RolesPage() {
  const roles = await getRoles();
  
  // Get user counts per role for display
  const roleStats = await Promise.all(roles.map(async (role) => {
    const count = await prisma.tenantUser.count({
      where: { roleId: role.id }
    });
    return { ...role, userCount: count };
  }));

  return <RolesClient initialRoles={roleStats} />;
}
