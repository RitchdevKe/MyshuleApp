"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

async function getConfigValue(name: string, defaultValue: boolean): Promise<boolean> {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  if (!policy) return defaultValue;
  return policy.status === "Active";
}

async function getConfigStringValue(name: string, defaultValue: string): Promise<string> {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  if (!policy) return defaultValue;
  return policy.description || defaultValue;
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

async function setConfigStringValue(name: string, value: string) {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  
  if (policy) {
    await prisma.securityPolicy.update({
      where: { id: policy.id },
      data: { description: value, status: "Active" }
    });
  } else {
    await prisma.securityPolicy.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        name,
        status: "Active",
        description: value,
        scope: "TenantConfig"
      }
    });
  }
}

export async function getAuthCenterConfig() {
  const [mfaEnabled, googleSso, microsoftSso, passwordLength] = await Promise.all([
    getConfigValue("AUTH_MFA_ENABLED", false),
    getConfigValue("AUTH_SSO_GOOGLE", false),
    getConfigValue("AUTH_SSO_MICROSOFT", false),
    getConfigStringValue("AUTH_PASSWORD_LENGTH", "12")
  ]);
  
  return { mfaEnabled, googleSso, microsoftSso, passwordLength };
}

export async function saveAuthCenterConfig(config: any) {
  if (config.mfaEnabled !== undefined) await setConfigValue("AUTH_MFA_ENABLED", config.mfaEnabled);
  if (config.googleSso !== undefined) await setConfigValue("AUTH_SSO_GOOGLE", config.googleSso);
  if (config.microsoftSso !== undefined) await setConfigValue("AUTH_SSO_MICROSOFT", config.microsoftSso);
  if (config.passwordLength !== undefined) await setConfigStringValue("AUTH_PASSWORD_LENGTH", config.passwordLength.toString());
  
  return getAuthCenterConfig();
}

export async function getCenterSecurityOverview() {
  const activePolicies = await prisma.securityPolicy.findMany({
    where: { tenantId: DEFAULT_TENANT_ID, status: "Active" }
  });
  
  const policyNames = activePolicies.map(p => p.name);
  
  const mfaEnabled = policyNames.includes("AUTH_MFA_ENABLED");
  const backupHealthy = policyNames.includes("SYSTEM_BACKUP_HEALTHY");
  const ipWhitelist = policyNames.includes("POLICY_IP_WHITELIST");
  const deviceTrust = policyNames.includes("POLICY_DEVICE_TRUST");
  const passwordLength = activePolicies.find(p => p.name === "AUTH_PASSWORD_LENGTH");
  
  let score = 0;
  let issues = 0;
  
  if (mfaEnabled) score += 25; else issues += 1;
  if (backupHealthy) score += 25; else issues += 1;
  if (ipWhitelist) score += 20; else issues += 1;
  if (deviceTrust) score += 20; else issues += 1;
  
  if (passwordLength && parseInt(passwordLength.description || "0") >= 12) {
    score += 10;
  } else {
    issues += 1;
  }
  
  return {
    score,
    issues,
    mfaEnabled,
    backupHealthy
  };
}
