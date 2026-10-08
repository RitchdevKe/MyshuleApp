"use server";
import prisma from "@/lib/prisma";

export async function getOperationalFilterOptions() {
  const branches = await prisma.branch.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return { branches };
}
