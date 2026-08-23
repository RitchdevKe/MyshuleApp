"use client";

import React from "react";
import { Users, Search, Filter, UserPlus, MapPin, CheckCircle2, AlertCircle, Phone } from "lucide-react";

export default function StudentTransportPage() {
  const students = [
    { id: "STU-2024-001", name: "Emily Chen", grade: "Grade 10", route: "North City Morning Run", stop: "Maple Street Junction", guardian: "Michael Chen", phone: "+1 234-567-8901", status: "Active" },
    { id: "STU-2024-045", name: "James Wilson", grade: "Grade 8", route: "East Suburbs Express", stop: "Oakwood Estate Gate", guardian: "Sarah Wilson", phone: "+1 234-567-8902", status: "Pending Payment" },
    { id: "STU-2024-112", name: "Sophia Patel", grade: "Grade 12", route: "West Valley Loop", stop: "Valley Central Mall", guardian: "Raj Patel", phone: "+1 234-567-8903", status: "Active" },
    { id: "STU-2024-088", name: "Lucas Garcia", grade: "Grade 9", route: "Downtown Special", stop: "City Center Plaza", guardian: "Maria Garcia", phone: "+1 234-567-8904", status: "Suspended" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Student Transport Roster</h2>
                 <p className="text-sm font-medium text-slate-500">Manage student route assignments and subscription status.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <UserPlus className="w-4 h-4" />
              Assign Student
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name, Route, or Stop..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Routes</option>
                 <option>North City Morning Run</option>
                 <option>East Suburbs Express</option>
                 <option>West Valley Loop</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Route & Stop</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guardian Contact</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Transport Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{student.id}</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span className="text-xs font-medium text-slate-500">{student.grade}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-primary-700 text-sm">{student.route}</p>
                    <div className="flex items-center gap-1 mt-1 text-slate-500">
                       <MapPin className="w-3 h-3" />
                       <span className="text-xs font-medium">{student.stop}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{student.guardian}</p>
                    <div className="flex items-center gap-1 mt-1 text-slate-500">
                       <Phone className="w-3 h-3" />
                       <span className="text-xs font-medium">{student.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      student.status === 'Pending Payment' ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {student.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {(student.status === 'Pending Payment' || student.status === 'Suspended') && <AlertCircle className="w-3.5 h-3.5" />}
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100">
                           Manage
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
