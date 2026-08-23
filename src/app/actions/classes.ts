"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

const REVALIDATE_PATHS = [
  "/dashboard/administration/system/organization",
  "/dashboard/registration/school-structure/classes"
];

function revalidateAll() {
  REVALIDATE_PATHS.forEach(p => revalidatePath(p));
}

export async function getClassesAndStreams() {
  return await prisma.class.findMany({
    where: { tenantId: DEFAULT_TENANT_ID },
    include: {
      branch: true,
      streams: {
        include: {
          _count: {
            select: { enrollments: true }
          }
        }
      },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: { name: 'asc' }
  });
}

export async function getBranches() {
  return await prisma.branch.findMany({
    where: { tenantId: DEFAULT_TENANT_ID }
  });
}

export async function createClass(data: { branchId: string; name: string }) {
  const result = await prisma.class.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      branchId: data.branchId,
      name: data.name,
    }
  });
  revalidateAll();
  return { success: true, id: result.id };
}

export async function updateClass(id: string, data: { branchId: string; name: string }) {
  await prisma.class.update({
    where: { id },
    data: {
      branchId: data.branchId,
      name: data.name,
    }
  });
  revalidateAll();
  return { success: true };
}

export async function deleteClass(id: string) {
  await prisma.class.delete({
    where: { id }
  });
  revalidateAll();
  return { success: true };
}

export async function createStream(data: { classId: string; name: string; capacity: number }) {
  const result = await prisma.stream.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      classId: data.classId,
      name: data.name,
      capacity: data.capacity,
    }
  });
  revalidateAll();
  return { success: true, id: result.id };
}

export async function updateStream(id: string, data: { classId: string; name: string; capacity: number }) {
  await prisma.stream.update({
    where: { id },
    data: {
      classId: data.classId,
      name: data.name,
      capacity: data.capacity,
    }
  });
  revalidateAll();
  return { success: true };
}

export async function deleteStream(id: string) {
  await prisma.stream.delete({
    where: { id }
  });
  revalidateAll();
  return { success: true };
}
