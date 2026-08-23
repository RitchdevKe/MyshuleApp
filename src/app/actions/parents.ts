'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getParents() {
  try {
    const parents = await prisma.parent.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        user: true,
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  include: { class: true }
                }
              }
            }
          }
        }
      },
      orderBy: { firstName: 'asc' }
    });
    return { success: true, data: parents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addParent(data: {
  firstName: string;
  lastName: string;
  email: string;
  phonePrimary: string;
  nationalIdNumber?: string;
  status: string; // 'Active' or 'Archived'
}) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: 'dummy_hash',
        phoneNumber: data.phonePrimary,
        status: data.status === 'Active' ? 'ACTIVE' : 'SUSPENDED'
      }
    });

    const parent = await prisma.parent.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phonePrimary: data.phonePrimary,
        nationalIdNumber: data.nationalIdNumber,
      }
    });

    revalidatePath('/dashboard/registration/parents/parents');
    return { success: true, data: parent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateParent(id: string, data: {
  firstName: string;
  lastName: string;
  email: string;
  phonePrimary: string;
  nationalIdNumber?: string;
  status: string;
}) {
  try {
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new Error("Parent not found");

    await prisma.user.update({
      where: { id: parent.userId },
      data: {
        email: data.email,
        phoneNumber: data.phonePrimary,
        status: data.status === 'Active' ? 'ACTIVE' : 'SUSPENDED'
      }
    });

    const updated = await prisma.parent.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phonePrimary: data.phonePrimary,
        nationalIdNumber: data.nationalIdNumber,
      }
    });

    revalidatePath('/dashboard/registration/parents/parents');
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteParent(id: string) {
  try {
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new Error("Parent not found");

    // Let's delete the user to cascade delete parent if it was created just for this.
    // Or just delete parent.
    await prisma.parent.delete({ where: { id } });
    
    // Attempt to delete user if no other roles (like staff/student) exist
    try {
      await prisma.user.delete({ where: { id: parent.userId } });
    } catch(e) {}

    revalidatePath('/dashboard/registration/parents/parents');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getParentLayoutStats() {
  try {
    const totalParents = await prisma.parent.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    
    // Active Guardians (can pick up)
    const activeGuardians = await prisma.studentParent.count({
      where: { tenantId: DEFAULT_TENANT_ID, canPickupFromSchool: true }
    });

    // Msgs This Month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const messagesCount = await prisma.communicationLog.count({
      where: { tenantId: DEFAULT_TENANT_ID, sentAt: { gte: startOfMonth } }
    });

    // Fee Balance Alerts (overdue invoices)
    const overdueInvoices = await prisma.invoice.count({
      where: { tenantId: DEFAULT_TENANT_ID, status: "UNPAID" }
    });

    return {
      totalParents,
      activeGuardians,
      messagesCount,
      overdueInvoices
    };
  } catch (error) {
    return {
      totalParents: 0,
      activeGuardians: 0,
      messagesCount: 0,
      overdueInvoices: 0
    };
  }
}
