import React from "react";
import { Users, UserCheck, UserX, ShieldAlert, MoreHorizontal, Mail, Shield } from "lucide-react";
import { getUserOverviewStats } from "@/app/actions/userManagement";

export default async function OverviewPage() {
  const stats = await getUserOverviewStats();

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: "Total Users", value: stats.total.toLocaleString(), icon: Users, color: "text-primary-600", bg: "bg-primary-50" },
            { label: "Active Users", value: stats.active.toLocaleString(), icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Suspended", value: stats.suspended.toLocaleString(), icon: UserX, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Pending Requests", value: stats.pendingRequests.toLocaleString(), icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
         ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                     <MoreHorizontal className="w-4 h-4" />
                  </button>
               </div>
               <h3 className="text-slate-500 font-bold text-sm mb-1">{stat.label}</h3>
               <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
            </div>
         ))}
      </div>

      {/* Directory Preview */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100/60 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Users Directory</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-bold">View All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {stats.recentUsers.map((user) => (
                     <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-black text-sm shadow-inner group-hover:bg-primary-100 transition-colors">
                                 {user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                 <div className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{user.email}</div>
                                 <div className="text-xs font-medium text-slate-500">{user.phoneNumber || "No phone"}</div>
                              </div>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-bold text-slate-600">
                                {user.tenantUsers?.[0]?.role?.name || "Unknown"}
                              </span>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                              user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                              user.status === 'LOCKED' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                           }`}>
                              {user.status}
                           </span>
                        </td>
                        <td className="py-4 px-6">
                           <span className="text-xs font-medium text-slate-500">
                             {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {stats.recentUsers.length === 0 && (
               <div className="p-12 text-center text-slate-500 font-medium text-sm">
                  No users found in directory.
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
