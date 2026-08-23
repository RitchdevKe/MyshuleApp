import React from "react";
import prisma from "@/lib/prisma";
import OrgChartClient from "./OrgChartClient";

export default async function OrgChartPage() {
  const staff = await prisma.staff.findMany({
    orderBy: [
      { department: 'asc' },
      { jobTitle: 'asc' },
      { firstName: 'asc' }
    ],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      jobTitle: true,
      department: true
    }
  });

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4">
          <h2 className="text-lg font-black text-slate-800 ml-2">Organizational Structure</h2>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export PDF
             </button>
          </div>
       </div>

       <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-8 overflow-x-auto">
         <OrgChartClient staff={staff} />
       </div>
    </div>
  );
}
