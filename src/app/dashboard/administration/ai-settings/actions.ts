"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addKnowledgeDocument(data: { title: string, category: string, content: string }) {
  const user = await prisma.user.findFirst({
    where: { role: { name: "SUPER_ADMIN" } },
  });

  if (!user) throw new Error("Unauthorized");

  await prisma.aIKnowledgeBase.create({
    data: {
      tenantId: user.tenantId,
      title: data.title,
      category: data.category,
      content: data.content,
    }
  });

  revalidatePath("/dashboard/administration/ai-settings");
  return { success: true };
}

export async function deleteKnowledgeDocument(id: string) {
  await prisma.aIKnowledgeBase.delete({ where: { id } });
  revalidatePath("/dashboard/administration/ai-settings");
  return { success: true };
}
