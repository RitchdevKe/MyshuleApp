import React from "react";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import TransportTabs from "./TransportTabs";

export default async function TransportLayout({ children }: { children: React.ReactNode }) {
  const [totalVehicles, activeVehicles, totalStudents] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "ACTIVE" } }),
    prisma.transportAssignment.count()
  ]);

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-6 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Transport</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage school vehicles, routes, drivers, and fuel consumption.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-white">{totalVehicles}</div>
              <div className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Vehicles</div>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-emerald-400">{activeVehicles}</div>
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Active</div>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-blue-400">{totalStudents}</div>
              <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Students Assigned</div>
            </div>
            <button className="flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-bold transition-all shadow-sm">
              <Plus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        <TransportTabs />
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
