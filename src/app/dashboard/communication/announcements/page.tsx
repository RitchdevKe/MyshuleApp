import React from "react";
import { Megaphone, Activity, CheckCircle2 } from "lucide-react";
import { getAnnouncements, getClassesForDropdown } from "./actions";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const [announcements, classes] = await Promise.all([
    getAnnouncements(),
    getClassesForDropdown()
  ]);

  const total = announcements.length;
  const published = announcements.filter(a => a.status === "Published").length;
  const scheduled = announcements.filter(a => a.status !== "Published").length;

  return (
    <div className="space-y-6">
      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Megaphone className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Broadcasts</p>
               <h3 className="text-2xl font-black text-slate-800">{total}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <Activity className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Published</p>
               <h3 className="text-2xl font-black text-slate-800">{published}</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Other Status</p>
               <h3 className="text-2xl font-black text-slate-800">{scheduled}</h3>
            </div>
         </div>
      </div>

      <AnnouncementsClient initialAnnouncements={announcements} classes={classes} />
    </div>
  );
}