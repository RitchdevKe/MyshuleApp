"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJournalEntry(data: {
  description: string;
  entryDate: string;
  lines: { accountId: string; debit: number; credit: number; description?: string }[];
}) {
  // Validate debit == credit
  const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new Error("Total Debit must equal Total Credit.");
  }

  if (data.lines.length < 2) {
    throw new Error("A journal entry must have at least two lines.");
  }

  // Get a tenant (hardcoded or first available for now, since we don't have auth context)
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    throw new Error("No tenant found");
  }

  // Generate entry number
  const count = await prisma.journalEntry.count({
    where: { tenantId: tenant.id },
  });
  const entryNumber = `JE-${new Date().getFullYear()}-${(count + 1)
    .toString()
    .padStart(3, "0")}`;

  const entry = await prisma.journalEntry.create({
    data: {
      tenantId: tenant.id,
      entryNumber,
      entryDate: new Date(data.entryDate),
      description: data.description,
      status: "DRAFT", // default status
      lines: {
        create: data.lines.map((line) => ({
          chartOfAccountId: line.accountId,
          debit: line.debit,
          credit: line.credit,
          description: line.description,
        })),
      },
    },
  });

  revalidatePath("/dashboard/finance/accounting/journals");
  return { success: true, data: entry };
}
