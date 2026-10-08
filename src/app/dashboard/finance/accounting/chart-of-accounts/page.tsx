import React from "react";
import prisma from "@/lib/prisma";
import { getChartOfAccounts } from "./data";
import ChartOfAccountsClient from "./ChartOfAccountsClient";

export default async function ChartOfAccountsPage() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error: No tenant found.</p>
      </div>
    );
  }

  const accountsData = await getChartOfAccounts(tenant.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Chart of Accounts</h1>
          <p className="text-slate-500 mt-1">Manage your accounting ledger and account structures</p>
        </div>
      </div>
      
      {/* Top Cards with real aggregated data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {accountsData.filter(g => ["ASSET", "LIABILITY", "REVENUE", "EXPENSE"].includes(g.rawType)).map((group) => (
          <div key={group.rawType} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-slate-500 font-semibold text-sm">{group.type}</h3>
            <p className="text-2xl font-black text-slate-800 mt-1">
              {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(group.balance)}
            </p>
          </div>
        ))}
      </div>

      <ChartOfAccountsClient initialData={accountsData} />
    </div>
  );
}
