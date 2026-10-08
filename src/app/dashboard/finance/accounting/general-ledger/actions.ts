"use server";

import prisma from "@/lib/prisma";

export async function getGeneralLedgerData() {
  const lines = await prisma.journalLine.findMany({
    include: {
      journalEntry: true,
      account: true,
    },
    orderBy: {
      journalEntry: {
        entryDate: 'desc',
      }
    }
  });

  return lines;
}

export async function getAccounts() {
  const accounts = await prisma.chartOfAccount.findMany({
    orderBy: {
      accountCode: 'asc',
    }
  });

  return accounts;
}
