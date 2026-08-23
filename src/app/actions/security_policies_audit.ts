"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "138dbb08-0e57-412f-b813-cfa271cd418c";

// --- POLICIES ACTIONS ---

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

async function getTimeoutValue(name: string, defaultValue: string): Promise<string> {
  const policy = await prisma.securityPolicy.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, name }
  });
  if (!policy) return defaultValue;
  return policy.description || defaultValue;
}

async function setTimeoutValue(name: string, value: string) {
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

export async function getExtendedPoliciesConfig() {
  const [ipWhitelist, deviceTrust] = await Promise.all([
    getConfigValue("POLICY_IP_WHITELIST", false),
    getConfigValue("POLICY_DEVICE_TRUST", false)
  ]);
  
  const idleSessionTimeout = await getTimeoutValue("POLICY_IDLE_TIMEOUT", "30");

  const ipRangesPolicies = await prisma.securityPolicy.findMany({
    where: { tenantId: DEFAULT_TENANT_ID, scope: "IP_RANGE" }
  });
  
  const ipRanges = ipRangesPolicies.map(p => p.name);

  return { ipWhitelist, deviceTrust, idleSessionTimeout, ipRanges };
}

export async function saveExtendedPoliciesConfig(config: {
  ipWhitelist?: boolean;
  deviceTrust?: boolean;
  idleSessionTimeout?: string;
  ipRanges?: string[];
}) {
  if (config.ipWhitelist !== undefined) await setConfigValue("POLICY_IP_WHITELIST", config.ipWhitelist);
  if (config.deviceTrust !== undefined) await setConfigValue("POLICY_DEVICE_TRUST", config.deviceTrust);
  if (config.idleSessionTimeout !== undefined) await setTimeoutValue("POLICY_IDLE_TIMEOUT", config.idleSessionTimeout);
  
  if (config.ipRanges !== undefined) {
    // Delete existing IP ranges
    await prisma.securityPolicy.deleteMany({
      where: { tenantId: DEFAULT_TENANT_ID, scope: "IP_RANGE" }
    });
    
    // Create new ones
    if (config.ipRanges.length > 0) {
      await prisma.securityPolicy.createMany({
        data: config.ipRanges.map(ip => ({
          tenantId: DEFAULT_TENANT_ID,
          name: ip,
          scope: "IP_RANGE",
          status: "Active"
        }))
      });
    }
  }
}

// --- AUDIT ACTIONS ---

export async function getFilteredAuditLogs(query: string, filterState: string) {
  const baseLogs = await prisma.auditLog.findMany({
    where: { 
      tenantId: DEFAULT_TENANT_ID,
      ...(query && {
        OR: [
          { action: { contains: query, mode: "insensitive" } },
          { entityName: { contains: query, mode: "insensitive" } },
        ]
      })
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  if (filterState === "failed") {
    return baseLogs.filter(l => l.action.toLowerCase().includes("fail") || l.action.toLowerCase().includes("error"));
  } else if (filterState === "success") {
    return baseLogs.filter(l => !(l.action.toLowerCase().includes("fail") || l.action.toLowerCase().includes("error")));
  }
  
  return baseLogs;
}

export async function logAuditExport() {
  const admin = await prisma.user.findFirst();
  await prisma.auditLog.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      userId: admin?.id || "unknown",
      action: "EXPORT_LOGS",
      entityName: "AuditLogs",
      ipAddress: "127.0.0.1"
    }
  });
}
