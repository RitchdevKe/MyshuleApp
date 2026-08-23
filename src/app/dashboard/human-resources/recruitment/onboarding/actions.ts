"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Department } from '@prisma/client';

const DEMO_TENANT_ID = "cm05moxk5000008lc6p7z1f1w";

type Step = {
  name: string;
  completed: boolean;
  icon: string;
};

export async function getOnboardings() {
  const onboardings = await prisma.onboarding.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return onboardings;
}

export async function createOnboarding(data: { name: string, role: string, department: string, startDate: string }) {
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant ? tenant.id : DEMO_TENANT_ID;

  const defaultSteps: Step[] = [
    { name: "Offer Accepted", completed: true, icon: "CheckCircle2" },
    { name: "Documents", completed: false, icon: "FileText" },
    { name: "Background Check", completed: false, icon: "ShieldCheck" },
    { name: "IT Setup", completed: false, icon: "Laptop" },
  ];

  await prisma.onboarding.create({
    data: {
      tenantId,
      name: data.name,
      role: data.role,
      department: data.department,
      startDate: new Date(data.startDate),
      progress: 25,
      steps: defaultSteps as any,
    }
  });

  revalidatePath('/dashboard/human-resources/recruitment/onboarding');
}

export async function updateOnboardingStep(id: string, stepIndex: number) {
  const onboarding = await prisma.onboarding.findUnique({ where: { id } });
  if (!onboarding) return;

  const steps = onboarding.steps as any[];
  if (!Array.isArray(steps)) return;

  steps[stepIndex].completed = !steps[stepIndex].completed;
  
  const completedCount = steps.filter((s: any) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  await prisma.onboarding.update({
    where: { id },
    data: {
      steps: steps as any,
      progress,
    }
  });

  revalidatePath('/dashboard/human-resources/recruitment/onboarding');
}

export async function removeOnboarding(id: string) {
  await prisma.onboarding.delete({
    where: { id }
  });

  revalidatePath('/dashboard/human-resources/recruitment/onboarding');
}

export async function promoteToStaff(id: string) {
  const onboarding = await prisma.onboarding.findUnique({ where: { id } });
  if (!onboarding) return;

  const tenantId = onboarding.tenantId;
  const email = `${onboarding.name.toLowerCase().replace(/\s/g, '.')}@example.com`;

  // Ensure email uniqueness for the mock
  let userEmail = email;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { email: userEmail } })) {
    userEmail = `${email.split('@')[0]}${suffix}@example.com`;
    suffix++;
  }

  const user = await prisma.user.create({
    data: {
      email: userEmail,
      passwordHash: "dummyhash",
      status: "ACTIVE",
      isVerified: true
    }
  });

  const departmentMap: Record<string, Department> = {
    'Academics': 'ACADEMICS',
    'Administration': 'ADMINISTRATION',
    'Transport': 'TRANSPORT',
    'Kitchen': 'KITCHEN',
    'Support': 'SUPPORT',
  };

  const validDept = departmentMap[onboarding.department] || Department.ACADEMICS;
  const names = onboarding.name.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ') || 'User';

  await prisma.staff.create({
    data: {
      tenantId,
      userId: user.id,
      employeeNumber: `EMP-${Date.now().toString().slice(-6)}`,
      firstName,
      lastName,
      jobTitle: onboarding.role,
      department: validDept,
      hireDate: onboarding.startDate,
      status: "ACTIVE"
    }
  });

  await prisma.onboarding.delete({
    where: { id }
  });

  revalidatePath('/dashboard/human-resources/recruitment/onboarding');
  revalidatePath('/dashboard/human-resources/staff');
}
