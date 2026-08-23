"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getBillingOverview() {
  const tenant = await prisma.tenant.findUnique({
    where: { id: DEFAULT_TENANT_ID }
  });

  const subscriptions = await prisma.tenantSubscription.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: { module: true },
  });

  const studentCount = await prisma.student.count({
    where: { tenantId: DEFAULT_TENANT_ID },
  });

  // Get total modules in the system
  const totalModulesCount = await prisma.systemModule.count();

  return { subscriptions, studentCount, totalModulesCount, tenant };
}

export async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    orderBy: { issueDate: 'desc' },
  });
  return invoices;
}

export async function getModuleSubscriptions() {
  const allModules = await prisma.systemModule.findMany({
    orderBy: { name: 'asc' },
  });
  const subscriptions = await prisma.tenantSubscription.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
  });
  return { allModules, subscriptions };
}

export async function getUsageStats() {
  const studentCount = await prisma.student.count({
    where: { tenantId: DEFAULT_TENANT_ID },
  });
  const staffCount = await prisma.staff.count({
    where: { tenantId: DEFAULT_TENANT_ID },
  });
  const invoiceCount = await prisma.invoice.count({
    where: { tenantId: DEFAULT_TENANT_ID },
  });
  return { studentCount, staffCount, invoiceCount };
}

export async function updatePlan(planName: string) {
  await prisma.tenant.update({
    where: { id: DEFAULT_TENANT_ID },
    data: { subscriptionPlan: planName }
  });
  
  return { success: true, planName, message: `Successfully changed plan to ${planName}` };
}

export async function activateModule(moduleId: string) {
  const existingSub = await prisma.tenantSubscription.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, moduleId }
  });

  if (!existingSub) {
    await prisma.tenantSubscription.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        moduleId,
        status: 'ACTIVE'
      }
    });
  }
  
  return { success: true };
}

export async function deactivateModule(moduleId: string) {
  const existingSub = await prisma.tenantSubscription.findFirst({
    where: { tenantId: DEFAULT_TENANT_ID, moduleId }
  });

  if (existingSub) {
    await prisma.tenantSubscription.delete({
      where: { id: existingSub.id }
    });
  }
  
  return { success: true };
}
