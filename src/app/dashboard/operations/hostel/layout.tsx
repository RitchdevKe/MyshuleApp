import React from "react";
import prisma from "@/lib/prisma";
import { NavTabs } from "./NavTabs";

export default async function HostelLayout({ children }: { children: React.ReactNode }) {
  // We should fetch these for the user's tenant if this was fully multi-tenant, but assuming single tenant for now or default tenant.
  const rooms = await prisma.hostelRoom.findMany();
  const totalBeds = rooms.reduce((acc, room) => acc + room.capacity, 0);
  
  const occupiedBeds = await prisma.hostelAllocation.count({
    where: {
      status: "ACTIVE"
    }
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Primary Color Hero Banner */}
      <div className="bg-primary-900 rounded-3xl p-5 shadow-sm text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Hostel & Boarding</h1>
            <p className="text-sm font-medium mt-1 text-primary-100">Manage hostels, room allocations, and boarding attendance.</p>
          </div>
          
          {/* KPI Summary */}
          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-white">{totalBeds}</div>
              <div className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Total Beds</div>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-center px-6 shadow-sm">
              <div className="text-2xl font-black text-emerald-400">{occupiedBeds}</div>
              <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Occupied</div>
            </div>
          </div>
        </div>

        <NavTabs />
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
