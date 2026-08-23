"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Database, FileText, Globe, Download, Trash2, CheckCircle2 } from "lucide-react";
import { handlePrivacyRequest } from "@/app/actions/security";
import { getPrivacySettings, savePrivacySetting } from "@/app/actions/security_privacy_sessions";
import { useRouter } from "next/navigation";

export default function PrivacyClient({ initialRequests }: { initialRequests: any[] }) {
  const [retentionPeriod, setRetentionPeriod] = useState("5 Years");
  const [tosUrl, setTosUrl] = useState("https://example.com/tos");
  const [privacyUrl, setPrivacyUrl] = useState("https://example.com/privacy");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    getPrivacySettings().then(data => {
      setRetentionPeriod(data.retention);
      setTosUrl(data.tosUrl);
      setPrivacyUrl(data.privacyUrl);
    });
  }, []);

  const handleAction = (id: string, action: string) => {
    startTransition(async () => {
      await handlePrivacyRequest(id, action);
      router.refresh();
    });
  };

  const handleUpdateUrl = (type: "TOS" | "PRIVACY") => {
    const currentUrl = type === "TOS" ? tosUrl : privacyUrl;
    const newUrl = window.prompt(`Enter new ${type === "TOS" ? "Terms of Service" : "Privacy Policy"} URL:`, currentUrl);
    if (newUrl && newUrl !== currentUrl) {
      startTransition(async () => {
        const policyName = type === "TOS" ? "PRIVACY_TOS_URL" : "PRIVACY_POLICY_URL";
        await savePrivacySetting(policyName, newUrl);
        if (type === "TOS") setTosUrl(newUrl);
        else setPrivacyUrl(newUrl);
        router.refresh();
      });
    }
  };

  const handleRetentionChange = (val: string) => {
    setRetentionPeriod(val);
    startTransition(async () => {
      await savePrivacySetting("PRIVACY_RETENTION", val);
      router.refresh();
    });
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] ${isPending ? 'opacity-70' : ''}`}>
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Privacy & Data Compliance</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Manage data retention, GDPR requests, and privacy policies.</p>
      </div>

      <div className="p-6 space-y-8">
         {/* Data Retention */}
         <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Database className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-lg">Data Retention Policy</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                     Automatically purge inactive student records and logs after a specified period to comply with data minimization principles.
                  </p>
                  
                  <div className="mt-4 flex gap-4 items-center">
                     <span className="text-sm font-bold text-slate-700">Retain inactive data for:</span>
                     <select 
                        value={retentionPeriod}
                        onChange={(e) => handleRetentionChange(e.target.value)}
                        disabled={isPending}
                        className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 disabled:opacity-50"
                     >
                        <option>1 Year</option>
                        <option>3 Years</option>
                        <option>5 Years</option>
                        <option>Indefinitely (Not Recommended)</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Privacy Requests (GDPR/CCPA) */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Privacy Requests (GDPR / CCPA)</h3>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
               {initialRequests.length === 0 ? (
                  <div className="p-6 text-center text-sm font-medium text-slate-500">
                     No privacy requests found.
                  </div>
               ) : (
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID & User</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {initialRequests.map((req) => (
                        <tr key={req.id}>
                           <td className="py-3 px-5">
                              <div className="font-bold text-sm text-slate-800">{req.id.substring(0,8)}</div>
                              <div className="text-xs text-slate-500 font-medium">{req.user?.email || 'Unknown User'}</div>
                           </td>
                           <td className="py-3 px-5 text-sm font-bold text-slate-700">{req.request || "Data Export"}</td>
                           <td className="py-3 px-5 text-sm font-medium text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                           <td className="py-3 px-5">
                              {req.status === 'PENDING' ? (
                                 <span className="inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-amber-100 text-amber-700">Pending</span>
                              ) : (
                                 <span className="inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-700">Completed</span>
                              )}
                           </td>
                           <td className="py-3 px-5 text-right">
                              {req.status === 'PENDING' ? (
                                 <div className="flex justify-end gap-2">
                                    <button disabled={isPending} onClick={() => handleAction(req.id, "EXPORT")} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors disabled:opacity-50" title="Export Data">
                                       <Download className="w-4 h-4" />
                                    </button>
                                    <button disabled={isPending} onClick={() => handleAction(req.id, "DELETE")} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors disabled:opacity-50" title="Delete Data">
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button disabled={isPending} onClick={() => handleAction(req.id, "RESOLVE")} className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors disabled:opacity-50" title="Mark as Resolved">
                                       <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              ) : (
                                 <span className="text-xs font-medium text-slate-400">Resolved</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               )}
            </div>
         </div>

         {/* Legal Documents */}
         <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Legal Agreements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-slate-400" />
                     <div>
                        <div className="font-bold text-sm text-slate-800">Terms of Service</div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]">{tosUrl}</div>
                     </div>
                  </div>
                  <button disabled={isPending} onClick={() => handleUpdateUrl("TOS")} className="text-xs font-bold text-primary-600 hover:underline disabled:opacity-50">Update URL</button>
               </div>
               
               <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <Globe className="w-5 h-5 text-slate-400" />
                     <div>
                        <div className="font-bold text-sm text-slate-800">Privacy Policy</div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]">{privacyUrl}</div>
                     </div>
                  </div>
                  <button disabled={isPending} onClick={() => handleUpdateUrl("PRIVACY")} className="text-xs font-bold text-primary-600 hover:underline disabled:opacity-50">Update URL</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
