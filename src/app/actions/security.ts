"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getSecurityOverview() {
  const authConfig = await getAuthConfig();
  const policiesConfig = await getPoliciesConfig();
  
  const logsCount = await prisma.auditLog.count({
    where: { tenantId: DEFAULT_TENANT_ID, action: { contains: "LOGIN" } }
  });
  const policiesCount = await prisma.securityPolicy.count({
    where: { tenantId: DEFAULT_TENANT_ID }
  });

  // simple mock calculation for score
  let score = 50;
  if (authConfig.mfaEnabled) score += 20;
  if (policiesConfig.ipWhitelist) score += 10;
  if (policiesConfig.deviceTrust) score += 10;
  if (policiesCount > 0) score += 10;

  return {
    score,
    mfaEnabled: authConfig.mfaEnabled,
    activeSessionsCount: logsCount,
    issues: score < 100 ? 2 : 0
  };
}

async function getConfigValue(name: string, defaultValue: boolean): Promise<boolean> {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  if (!policy) return defaultValue;
  return policy.status === "Active";
}

async function setConfigValue(name: string, value: boolean) {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  
  const status = value ? "Active" : "Inactive";
  
  if (policy) {
    await prisma.securityPolicy.update({
      where: { id: policy.id },
      data: { status }
    });
  } else {
    await prisma.securityPolicy.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        name,
        status,
        scope: "TenantConfig"
      }
    });
  }
}

export async function getAuthConfig() {
  const [mfaEnabled, googleSso, microsoftSso] = await Promise.all([
    getConfigValue("AUTH_MFA_ENABLED", false),
    getConfigValue("AUTH_SSO_GOOGLE", false),
    getConfigValue("AUTH_SSO_MICROSOFT", false)
  ]);
  
  return { mfaEnabled, googleSso, microsoftSso };
}

export async function saveAuthConfig(config: any) {
  if (config.mfaEnabled !== undefined) await setConfigValue("AUTH_MFA_ENABLED", config.mfaEnabled);
  if (config.googleSso !== undefined) await setConfigValue("AUTH_SSO_GOOGLE", config.googleSso);
  if (config.microsoftSso !== undefined) await setConfigValue("AUTH_SSO_MICROSOFT", config.microsoftSso);
  return getAuthConfig();
}

export async function getPoliciesConfig() {
  const [ipWhitelist, deviceTrust] = await Promise.all([
    getConfigValue("POLICY_IP_WHITELIST", false),
    getConfigValue("POLICY_DEVICE_TRUST", false)
  ]);
  
  return { ipWhitelist, deviceTrust };
}

export async function savePoliciesConfig(config: any) {
  if (config.ipWhitelist !== undefined) await setConfigValue("POLICY_IP_WHITELIST", config.ipWhitelist);
  if (config.deviceTrust !== undefined) await setConfigValue("POLICY_DEVICE_TRUST", config.deviceTrust);
  return getPoliciesConfig();
}

export async function getRecentSessions() {
  const logs = await prisma.auditLog.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: true }
  });
  return logs;
}

export async function getPrivacyRequests() {
  const requests = await prisma.accessRequest.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  return requests;
}

export async function handlePrivacyRequest(id: string, action: string) {
  // Update the request status
  const status = ["approve", "APPROVED", "RESOLVE", "EXPORT", "DELETE"].includes(action) ? "APPROVED" : "REJECTED";
  await prisma.accessRequest.update({
    where: { id },
    data: { status }
  });
  return { success: true };
}

export async function getSecurityAuditLogs() {
  return prisma.auditLog.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}
