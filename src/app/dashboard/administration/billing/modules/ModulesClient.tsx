"use client";

import React, { useState, useTransition } from "react";
import { Search, Package, Plus, CheckCircle2 } from "lucide-react";
import { activateModule, deactivateModule } from "@/app/actions/billing";
import { useRouter } from "next/navigation";

interface SystemModule {
  id: string;
  name: string;
  description: string | null;
  isMandatory: boolean;
}

interface TenantSubscription {
  id: string;
  moduleId: string;
  status: string;
}

interface ModulesClientProps {
  allModules: SystemModule[];
  subscriptions: TenantSubscription[];
}

export default function ModulesClient({ allModules, subscriptions }: ModulesClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleActivate = (moduleId: string) => {
    startTransition(async () => {
      await activateModule(moduleId);
      router.refresh();
    });
  };

  const filteredModules = allModules.filter(mod => 
    mod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (mod.description && mod.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search modules & add-ons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredModules.map((mod) => {
            const isSubscribed = subscriptions.some(sub => sub.moduleId === mod.id);
            const status = isSubscribed ? 'Included' : 'Available';

            return (
              <div key={mod.id} className={`border rounded-2xl p-5 flex flex-col transition-all group ${
                 status === 'Included' 
                 ? 'border-emerald-200 bg-emerald-50/30 shadow-sm' 
                 : 'border-slate-200 bg-white hover:border-primary-400 hover:shadow-md'
              }`}>
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${
                       status === 'Included' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-50 text-primary-600'
                    }`}>
                       <Package className="w-5 h-5" />
                    </div>
                    {status === 'Included' ? (
                       <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" /> Active
                       </span>
                    ) : (
                       <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          Add-on
                       </span>
                    )}
                 </div>
                 
                 <h4 className="font-bold text-slate-800 text-lg mb-1">{mod.name}</h4>
                 <p className="text-sm text-slate-500 font-medium flex-1 mb-6">{mod.description || "No description available."}</p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-slate-100/80 mt-auto">
                    <div className="font-bold text-slate-800">
                       {status === 'Included' || mod.isMandatory ? "Free" : "Custom"}
                    </div>
                    {status === 'Included' ? (
                       <button 
                          onClick={() => {
                            startTransition(async () => {
                              await deactivateModule(mod.id);
                              router.refresh();
                            });
                          }}
                          disabled={isPending || mod.isMandatory}
                          className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-colors disabled:opacity-50"
                       >
                          Remove
                       </button>
                    ) : (
                       <button 
                          onClick={() => handleActivate(mod.id)}
                          disabled={isPending}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm shadow-primary-900/20 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" /> {isPending ? "Adding..." : "Add Module"}
                       </button>
                    )}
                 </div>
              </div>
            );
         })}
         {filteredModules.length === 0 && (
           <div className="col-span-full text-center py-12 text-slate-500 font-bold">
             No modules found.
           </div>
         )}
      </div>
    </div>
  );
}
