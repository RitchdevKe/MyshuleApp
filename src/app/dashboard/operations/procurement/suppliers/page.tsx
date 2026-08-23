"use client";

import React from "react";
import { History, Search, Filter, Phone, Mail, MapPin, Building, Star } from "lucide-react";

export default function SuppliersPage() {
  const suppliers = [
    { id: "VND-101", name: "TechCorp Solutions", category: "IT Hardware", contact: "John Smith", email: "orders@techcorp.com", phone: "+1 (555) 123-4567", rating: 4.8, spendYtd: "$145,200" },
    { id: "VND-102", name: "Office Max Supplies", category: "Stationery", contact: "Sarah Jenkins", email: "sales@officemax.com", phone: "+1 (555) 987-6543", rating: 4.5, spendYtd: "$12,450" },
    { id: "VND-103", name: "EduTech Global", category: "Software Licensing", contact: "Michael Chang", email: "m.chang@edutech.io", phone: "+1 (555) 345-6789", rating: 4.9, spendYtd: "$85,000" },
    { id: "VND-104", name: "Facilities Plus", category: "Maintenance", contact: "Emma Davis", email: "support@facilitiesplus.net", phone: "+1 (555) 234-5678", rating: 3.8, spendYtd: "$34,100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Supplier Directory</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Category Filter
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
               
               <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200/60 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-3">
                           <Building className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{supplier.id}</span>
                     </div>
                     <h3 className="text-xl font-black text-slate-800">{supplier.name}</h3>
                     <p className="text-sm font-bold text-primary-600 mt-1">{supplier.category}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200/60">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spend (YTD)</p>
                     <p className="text-2xl font-black text-slate-800">{supplier.spendYtd}</p>
                  </div>
               </div>

               <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Contact</p>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                 <span className="text-xs font-black text-slate-600">{supplier.contact.charAt(0)}</span>
                              </div>
                              <span className="text-sm font-bold text-slate-700">{supplier.contact}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-sm font-medium text-slate-600">{supplier.email}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-sm font-medium text-slate-600">{supplier.phone}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Supplier Reliability Score</p>
                        <div className="flex items-center gap-2 mb-2">
                           <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                           <span className="text-xl font-black text-slate-800">{supplier.rating}</span>
                           <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                        </div>
                        <div className="h-2 w-full max-w-[200px] bg-slate-100 rounded-full overflow-hidden mb-2">
                           <div className={`h-full rounded-full ${supplier.rating >= 4.5 ? 'bg-emerald-500' : supplier.rating >= 4.0 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${(supplier.rating / 5) * 100}%` }}></div>
                        </div>
                        <p className="text-xs font-medium text-slate-500">Based on delivery time, quality, and pricing.</p>
                     </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                     <button className="px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                        View Purchase History
                     </button>
                     <button className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl font-bold text-sm transition-all">
                        Create New PO
                     </button>
                  </div>
               </div>

            </div>
         ))}
      </div>
    </div>
  );
}
