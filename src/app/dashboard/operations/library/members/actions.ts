'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getLibraryMembers() {
  try {
    const members = await prisma.libraryMember.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        student: {
          include: {
            enrollments: {
              include: { class: true },
              orderBy: { id: 'desc' },
              take: 1
            }
          }
        },
        circulations: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return members;
  } catch (error) {
    console.error('Failed to get library members:', error);
    throw new Error('Failed to fetch library members');
  }
}

export async function getStudentsForLibrary() {
  try {
    // Get students who don't already have a library membership
    const students = await prisma.student.findMany({
      where: { 
        tenantId: DEFAULT_TENANT_ID,
        libraryMember: null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNumber: true,
        enrollments: {
          include: { class: true },
          take: 1,
          orderBy: { id: 'desc' }
        }
      },
      orderBy: { firstName: 'asc' }
    });
    return students;
  } catch (error) {
    console.error('Failed to get students:', error);
    throw new Error('Failed to fetch students');
  }
}

export async function addLibraryMember(studentId: string) {
  try {
    await prisma.libraryMember.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        studentId,
        status: 'ACTIVE',
        maxBooks: 3,
      }
    });
    revalidatePath('/dashboard/operations/library/members');
  } catch (error) {
    console.error('Failed to add library member:', error);
    throw new Error('Failed to add library member');
  }
}

export async function removeLibraryMember(memberId: string) {
  try {
    await prisma.libraryMember.delete({
      where: { id: memberId }
    });
    revalidatePath('/dashboard/operations/library/members');
  } catch (error) {
    console.error('Failed to remove library member:', error);
    throw new Error('Failed to remove library member');
  }
}
