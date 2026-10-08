"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAIReportData() {
  const session = await getSession();
  if (!session?.tenantId) {
    throw new Error("Unauthorized");
  }
  const tenantId = session.tenantId;

  // 1. Financial Data
  // Income from Payments
  const incomeResult = await prisma.payment.aggregate({
    where: { tenantId, status: "ALLOCATED" },
    _sum: { amount: true },
  });
  const totalIncome = incomeResult._sum.amount || 0;

  // Expenses from PurchaseOrders, FuelRecords, PettyCash
  const poResult = await prisma.purchaseOrder.aggregate({
    where: { tenantId },
    _sum: { totalAmount: true },
  });
  const fuelCostResult = await prisma.fuelRecord.aggregate({
    where: { tenantId },
    _sum: { cost: true },
  });
  const pettyCashResult = await prisma.pettyCashTransaction.aggregate({
    where: { account: { tenantId }, type: "OUT" },
    _sum: { amount: true },
  });

  const totalExpense = (poResult._sum.totalAmount || 0) + 
                       (fuelCostResult._sum.cost || 0) + 
                       (pettyCashResult._sum.amount || 0);

  // 2. Vehicle/Fleet Data
  const vehicles = await prisma.vehicle.findMany({
    where: { tenantId },
    include: {
      trips: {
        where: { status: "COMPLETED" }
      },
      fuelRecords: true,
    }
  });

  const fleetData = vehicles.map((v: any) => {
    const totalTrips = v.trips.length;
    const totalFuelCost = v.fuelRecords.reduce((acc: number, curr: any) => acc + curr.cost, 0);
    const totalFuelAmount = v.fuelRecords.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      status: v.status,
      totalTrips,
      totalFuelCost,
      totalFuelAmount
    };
  });

  return {
    financial: {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      breakdown: {
        purchaseOrders: poResult._sum.totalAmount || 0,
        fuelCosts: fuelCostResult._sum.cost || 0,
        pettyCash: pettyCashResult._sum.amount || 0,
      }
    },
    fleet: fleetData,
  };
}
