import React from "react";
import { NavTabs } from "./NavTabs";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function FeesBillingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const tenantId = session?.tenantId || "1e8a93ff-1533-4f1a-b337-1473919ff7f2";
  
  // Calculate top bar metrics
  const invoices = await prisma.invoice.aggregate({
    where: { tenantId },
    _sum: {
      totalAmount: true,
      amountPaid: true,
      balanceDue: true
    }
  });

  const totalInvoiced = invoices._sum.totalAmount || 0;
  const totalCollected = invoices._sum.amountPaid || 0;
  const totalOutstanding = invoices._sum.balanceDue || 0;

  const formatCurrency = (val: number) => `KSh ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Card */}
      <div className="bg-primary-900 p-6 rounded-3xl text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Fees & Billing</h1>
          <p className="text-sm text-primary-200 font-medium mt-1">Manage student accounts, fee structures, and generate invoices.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-primary-300 font-bold uppercase tracking-wider">Total Invoiced</span>
            <span className="text-xl font-black text-white">{formatCurrency(totalInvoiced)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-primary-300 font-bold uppercase tracking-wider">Total Collected</span>
            <span className="text-xl font-black text-emerald-400">{formatCurrency(totalCollected)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-primary-300 font-bold uppercase tracking-wider">Outstanding</span>
            <span className="text-xl font-black text-rose-400">{formatCurrency(totalOutstanding)}</span>
          </div>
        </div>
      </div>

      <NavTabs />

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
