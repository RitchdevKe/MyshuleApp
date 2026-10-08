"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/communication/announcements";

export async function getAnnouncements() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const announcements = await prisma.announcement.findMany({
    where: { tenantId: tenant.id },
    include: {
      createdBy: {
        include: { staff: true, parents: true, students: true }
      },
      targetClass: true,
    },
    orderBy: { publishDate: "desc" },
  });

  return announcements.map(a => {
    let name = "Unknown User";
    if (a.createdBy.staff && a.createdBy.staff.length > 0) {
      name = `${a.createdBy.staff[0].firstName} ${a.createdBy.staff[0].lastName}`;
    } else if (a.createdBy.parents && a.createdBy.parents.length > 0) {
      name = `${a.createdBy.parents[0].firstName} ${a.createdBy.parents[0].lastName}`;
    } else if (a.createdBy.students && a.createdBy.students.length > 0) {
      name = `${a.createdBy.students[0].firstName} ${a.createdBy.students[0].lastName}`;
    }
    
    return {
      id: a.id,
      title: a.title,
      content: a.content,
      audience: a.targetAudience,
      targetClassId: a.targetClassId,
      targetClassName: a.targetClass?.name || null,
      date: a.publishDate.toISOString(),
      expiryDate: a.expiryDate?.toISOString() || null,
      type: "Notice",
      status: (a.expiryDate && new Date(a.expiryDate) < new Date()) ? "Expired" : "Published",
      author: name,
      reach: "Pending",
    };
  });
}

export async function getClassesForDropdown() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  const classes = await prisma.class.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return classes;
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  targetAudience: "ALL" | "STAFF_ONLY" | "STUDENTS_ONLY" | "PARENTS_ONLY" | "SPECIFIC_CLASS" | "MANAGEMENT_ONLY";
  targetClassId?: string;
}) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const adminUser = await prisma.user.findFirst({
    where: { tenantUsers: { some: { tenantId: tenant.id, role: { name: "Admin" } } } }
  });
  
  // fallback if no explicitly named Admin role
  const authorId = adminUser?.id || (await prisma.user.findFirst({
    where: { tenantUsers: { some: { tenantId: tenant.id } } }
  }))?.id;
  
  if (!authorId) throw new Error("No user found to author announcement");

  await prisma.announcement.create({
    data: {
      tenantId: tenant.id,
      createdById: authorId,
      title: data.title,
      content: data.content,
      targetAudience: data.targetAudience,
      targetClassId: data.targetClassId || null,
    },
  });

  revalidatePath(REVALIDATE_PATH);
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } });
  revalidatePath(REVALIDATE_PATH);
}
