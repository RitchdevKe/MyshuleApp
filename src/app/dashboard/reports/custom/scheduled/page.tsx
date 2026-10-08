import React from "react";
import { getSession } from "@/lib/auth";
import { getScheduledReports, getAllCustomReports } from "./actions";
import ScheduledClient from "./ScheduledClient";
import { redirect } from "next/navigation";

export default async function ScheduledReportsPage() {
  const session = await getSession();
  if (!session?.tenantId) {
    redirect("/login");
  }

  const scheduledReports = await getScheduledReports(session.tenantId);
  const allReports = await getAllCustomReports(session.tenantId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Scheduled Reports
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-2">
            Manage your automated report deliveries
          </p>
        </div>
      </div>
      
      <ScheduledClient 
        tenantId={session.tenantId}
        initialScheduledReports={scheduledReports} 
        allReports={allReports} 
      />
    </div>
  );
}
