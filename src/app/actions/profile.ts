
'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function getCurrentUserProfile() {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user) return null;

  // Try to find if they are Staff
  const staff = await prisma.staff.findFirst({ where: { userId: user.id } });
  if (staff) return { name: staff.firstName + ' ' + staff.lastName, email: user.email, role: session.roleName };

  // Try Student
  const student = await prisma.student.findFirst({ where: { userId: user.id } });
  if (student) return { name: student.firstName + ' ' + student.lastName, email: user.email, role: session.roleName };

  // Try Parent
  const parent = await prisma.parent.findFirst({ where: { userId: user.id } });
  if (parent) return { name: parent.firstName + ' ' + parent.lastName, email: user.email, role: session.roleName };

  return { name: user.email.split('@')[0], email: user.email, role: session.roleName };
}
