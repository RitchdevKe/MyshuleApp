import React from "react";
import { ArrowRightLeft, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MovementsClient from "./movements-client";

export default async function MovementsPage() {
  const session = await getSession();
  if (!session?.tenantId) {
    redirect("/");
  }

  const { tenantId } = session;

  const movements = await prisma.stockMovement.findMany({
    where: { tenantId },
    include: {
      item: true,
      sourceStore: true,
      destinationStore: true,
    },
    orderBy: { date: 'desc' },
  });

  // Calculate metrics
  const totalMovements = movements.length;
  const stockInCount = movements.filter((m: any) => m.movementType === "IN").length;
  const stockOutCount = movements.filter((m: any) => m.movementType === "OUT").length;
  const transferCount = movements.filter((m: any) => m.movementType === "TRANSFER").length;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-4">
                <ArrowRightLeft className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Movements</p>
             <p className="text-3xl font-black text-slate-800">{totalMovements}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl inline-block mb-4">
                <ArrowDownRight className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock In</p>
             <p className="text-3xl font-black text-emerald-600">{stockInCount}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl inline-block mb-4">
                <ArrowUpRight className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Out</p>
             <p className="text-3xl font-black text-rose-600">{stockOutCount}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl inline-block mb-4">
                <RefreshCcw className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transfers</p>
             <p className="text-3xl font-black text-amber-600">{transferCount}</p>
          </div>
        </div>
      </div>

      <MovementsClient movements={movements as any} />
    </div>
  );
}
