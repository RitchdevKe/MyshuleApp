"use server";

import prisma from '@/lib/prisma';

export async function getCashFlowData() {
  const bankTransactions = await prisma.bankTransaction.findMany({
    orderBy: { date: 'desc' }
  });

  const pettyCashTransactions = await prisma.pettyCashTransaction.findMany({
    orderBy: { date: 'desc' }
  });

  return { bankTransactions, pettyCashTransactions };
}
