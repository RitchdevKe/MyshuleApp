"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

// --- Policies ---

export async function getPolicies() {
  return await prisma.securityPolicy.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPolicy(data: { name: string; description: string; scope: string }) {
  await prisma.securityPolicy.create({
    data: {
      tenantId: TENANT_ID,
      name: data.name,
      description: data.description,
      scope: data.scope,
      status: "Active",
    },
  });
  revalidatePath("/dashboard/administration/roles/policies");
}

export async function togglePolicyStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
  await prisma.securityPolicy.update({
    where: { id, tenantId: TENANT_ID },
    data: { status: newStatus },
  });
  revalidatePath("/dashboard/administration/roles/policies");
}

// --- Rules ---

export async function getRules() {
  return await prisma.authorizationRule.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRule(data: { action: string; trigger: string; approver: string }) {
  await prisma.authorizationRule.create({
    data: {
      tenantId: TENANT_ID,
      action: data.action,
      trigger: data.trigger,
      approver: data.approver,
      status: "Active",
    },
  });
  revalidatePath("/dashboard/administration/roles/rules");
}

export async function toggleRuleStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
  await prisma.authorizationRule.update({
    where: { id, tenantId: TENANT_ID },
    data: { status: newStatus },
  });
  revalidatePath("/dashboard/administration/roles/rules");
}
