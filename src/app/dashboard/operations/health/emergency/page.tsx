"use client";

import React from "react";
import { PhoneCall, Search, Filter, Plus, ShieldAlert, Phone, Mail, User, Ambulance, AlertTriangle } from "lucide-react";

export default function EmergencyPage() {
  const contacts = [
    { id: "EMG-01", student: "Sarah Williams", grade: "Grade 12", contactName: "Robert Williams", relation: "Father", phone: "+1 (555) 123-4567", altPhone: "+1 (555) 987-6543", doctor: "Dr. James Smith (555-0001)" },
    { id: "EMG-02", student: "Michael Johnson", grade: "Grade 9", contactName: "Mary Johnson", relation: "Mother", phone: "+1 (555) 234-5678", altPhone: "-", doctor: "Dr. Emily Chen (555-0002)" },
    { id: "EMG-03", student: "Emily Chen", grade: "Grade 10", contactName: "David Chen", relation: "Father", phone: "+1 (555) 345-6789", altPhone: "+1 (555) 876-5432", doctor: "City Hospital (555-0003)" },
    { id: "EMG-04", student: "David Kim", grade: "Grade 8", contactName: "Sarah Kim", relation: "Mother", phone: "+1 (555) 456-7890", altPhone: "-", doctor: "Dr. Sarah Kim (555-0004)" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-rose-600 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg shadow-rose-600/20">
            <div>
               <h3 className="text-2xl font-black mb-1 flex items-center gap-2">
                  <PhoneCall className="w-6 h-6 animate-pulse" /> Dispatch Ambulance
               </h3>
               <p className="text-rose-100 font-medium">Quick dial for critical emergencies.</p>
            </div>
            <button className="bg-white text-rose-600 px-6 py-3 rounded-xl font-black text-lg hover:bg-rose-50 transition-colors shadow-sm">
               911
            </button>
         </div>
         <div className="bg-amber-500 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg shadow-amber-500/20">
            <div>
               <h3 className="text-2xl font-black mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" /> Local Hospital
               </h3>
               <p className="text-amber-100 font-medium">City General Hospital ER.</p>
            </div>
            <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-black text-lg hover:bg-amber-50 transition-colors shadow-sm">
               (555) 000-9999
            </button>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl hidden md:block">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Emergency Contacts</h2>
                 <p className="text-sm font-medium text-slate-500">Rapid access to student guardians and designated family doctors.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Update Contacts
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name or Guardian..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Grades</option>
                 <option>Grade 8</option>
                 <option>Grade 9</option>
                 <option>Grade 10</option>
                 <option>Grade 12</option>
              </select>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Guardian</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Numbers</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Family Doctor</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {contacts.map((contact) => (
                   <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{contact.student}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-medium text-slate-500">{contact.grade}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-700 text-sm">{contact.contactName}</p>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                           {contact.relation}
                        </p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              {contact.phone}
                           </div>
                           {contact.altPhone !== '-' && (
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                 <Phone className="w-3.5 h-3.5" />
                                 {contact.altPhone}
                              </div>
                           )}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <Ambulance className="w-4 h-4 text-blue-500" />
                          {contact.doctor}
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors shadow-sm inline-flex items-center gap-2">
                           <PhoneCall className="w-4 h-4" /> Call
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
