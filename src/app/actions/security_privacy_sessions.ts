"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

// --- Sessions ---
export async function revokeSession(auditLogId: string) {
  try {
    await prisma.auditLog.delete({
      where: { id: auditLogId }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke session", error);
    return { success: false, error: "Failed to revoke session" };
  }
}

export async function revokeAllSessions() {
  try {
    await prisma.auditLog.deleteMany({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke all sessions", error);
    return { success: false, error: "Failed to revoke all sessions" };
  }
}

// --- Privacy ---
export async function getPrivacySettings() {
  const policies = await prisma.securityPolicy.findMany({
    where: {
      tenantId: DEFAULT_TENANT_ID,
      name: { in: ["PRIVACY_RETENTION", "PRIVACY_TOS_URL", "PRIVACY_POLICY_URL"] }
    }
  });

  const getPolicy = (name: string, defaultVal: string) => {
    const policy = policies.find(p => p.name === name);
    return policy ? policy.description || defaultVal : defaultVal;
  };

  return {
    retention: getPolicy("PRIVACY_RETENTION", "5 Years"),
    tosUrl: getPolicy("PRIVACY_TOS_URL", "https://example.com/tos"),
    privacyUrl: getPolicy("PRIVACY_POLICY_URL", "https://example.com/privacy"),
  };
}

export async function savePrivacySetting(name: string, value: string) {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });

  if (policy) {
    await prisma.securityPolicy.update({
      where: { id: policy.id },
      data: { description: value }
    });
  } else {
    await prisma.securityPolicy.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        name,
        description: value,
        scope: "PrivacyConfig",
        status: "Active"
      }
    });
  }
  return { success: true };
}
