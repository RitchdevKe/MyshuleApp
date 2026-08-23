"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

export async function getSubscriptionDetails() {
  const tenantId = DEFAULT_TENANT_ID;
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscriptions: {
        include: {
          module: true
        }
      }
    }
  });
  return tenant;
}

export async function getPaymentMethods() {
  const tenantId = DEFAULT_TENANT_ID;
  const gateways = await prisma.paymentGateway.findMany({
    where: { tenantId }
  });
  return gateways;
}

export async function addPaymentMethod(data: { providerName: string, apiKey?: string, apiSecret?: string, paybillNumber?: string }) {
  const tenantId = DEFAULT_TENANT_ID;
  await prisma.paymentGateway.create({
    data: {
      tenantId,
      ...data,
      isActive: true
    }
  });
  revalidatePath("/dashboard/administration/subscription/payment-methods");
}

export async function deletePaymentMethod(id: string) {
  await prisma.paymentGateway.delete({
    where: { id }
  });
  revalidatePath("/dashboard/administration/subscription/payment-methods");
}

export async function getBillingHistory() {
  const tenantId = DEFAULT_TENANT_ID;
  const invoices = await prisma.invoice.findMany({
    where: { tenantId },
    include: {
      payments: true
    },
    orderBy: { issueDate: 'desc' }
  });
  return invoices;
}

export async function getAvailablePlans() {
  // Mock available plans/modules for now since the schema models SystemModule for subscriptions
  const modules = await prisma.systemModule.findMany({
    where: { isMandatory: false }
  });
  
  // Return some static plans structured based on system modules
  return [
    {
      id: "plan-free",
      name: "Free",
      price: 0,
      features: ["Core modules", "Up to 50 students", "Basic support"],
      modules: []
    },
    {
      id: "plan-pro",
      name: "Professional",
      price: 49.99,
      features: ["All core modules", "Up to 500 students", "Priority support", "Finance module"],
      modules: []
    },
    {
      id: "plan-business",
      name: "Business",
      price: 99.99,
      features: ["All modules", "Unlimited students", "24/7 Phone support", "Custom domain"],
      modules: []
    },
    {
      id: "plan-enterprise",
      name: "Enterprise",
      price: 199.99,
      features: ["Everything in Business", "Dedicated account manager", "On-premise option", "Custom integrations"],
      modules: []
    }
  ];
}

export async function upgradePlan(planId: string) {
  // Plan IDs are like plan-free, plan-pro, plan-business, plan-enterprise
  const planMap: Record<string, string> = {
    'plan-free': 'Free',
    'plan-pro': 'Professional',
    'plan-business': 'Business',
    'plan-enterprise': 'Enterprise'
  };
  const planName = planMap[planId] || planId;

  await prisma.tenant.update({
    where: { id: DEFAULT_TENANT_ID },
    data: { subscriptionPlan: planName }
  });

  revalidatePath("/dashboard/administration/subscription/upgrades");
}
