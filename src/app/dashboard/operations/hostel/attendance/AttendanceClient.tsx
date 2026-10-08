"use client";

import React, { useState, useTransition } from "react";
import { CheckCircle2, Search, Filter, Calendar, Clock, AlertCircle, XCircle, Loader2 } from "lucide-react";
import { markAttendance } from "./actions";
import { useRouter } from "next/navigation";

export default function AttendanceClient({ students, initialAttendance, stats }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMark = async (studentId: string, status: string) => {
    startTransition(async () => {
       await markAttendance({ studentId, status });
       router.refresh();
    });
  };

  // Combine students with attendance
  const records = students.map((student: any) => {
    const att = initialAttendance.find((a: any) => a.studentId === student.id);
    return {
       id: att ? att.id : student.id,
       studentId: student.id,
       studentName: `${student.firstName} ${student.lastName}`,
       admissionNumber: student.admissionNumber,
       hostel: student.hostelAllocation?.hostel?.name || "Unknown",
       room: student.hostelAllocation?.room?.roomNumber || "Unknown",
       status: att ? att.status : "UNRECORDED",
       time: att ? new Date(att.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-",
       date: att ? new Date(att.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
    }
  });

  const filteredRecords = records.filter((r: any) => {
     const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.room.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = filterStatus === "All Statuses" || 
         (filterStatus === "Present" && r.status === "PRESENT") ||
         (filterStatus === "Absent" && r.status === "ABSENT") ||
         (filterStatus === "On Leave" && r.status === "LEAVE") ||
         (filterStatus === "Unrecorded" && r.status === "UNRECORDED");
     return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
           <h3 className="text-sm font-medium text-slate-500 mb-1">Total Boarders</h3>
           <p className="text-2xl font-black text-slate-800">{stats.totalBoarders}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
           <h3 className="text-sm font-medium text-emerald-600 mb-1">Present Today</h3>
           <p className="text-2xl font-black text-slate-800">{stats.present}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
           <h3 className="text-sm font-medium text-rose-600 mb-1">Absent Today</h3>
           <p className="text-2xl font-black text-slate-800">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
           <h3 className="text-sm font-medium text-amber-600 mb-1">Unrecorded / Leave</h3>
           <p className="text-2xl font-black text-slate-800">{stats.unrecorded} / {stats.onLeave}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Daily Boarding Attendance</h2>
                 <p className="text-sm font-medium text-slate-500">Track evening roll calls and student presence in hostels.</p>
              </div>
           </div>
           {isPending && <Loader2 className="w-5 h-5 text-primary-900 animate-spin" />}
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Student or Room..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Calendar className="w-4 h-4" />
                 Today
              </button>
              <select 
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                 <option>All Statuses</option>
                 <option>Present</option>
                 <option>Absent</option>
                 <option>On Leave</option>
                 <option>Unrecorded</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel & Room</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredRecords.map((record: any) => (
                   <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{record.studentName}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{record.admissionNumber}</span>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{record.room}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{record.hostel}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700 text-sm">{record.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <Clock className="w-3.5 h-3.5" /> {record.time}
                        </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 
                         record.status === 'ABSENT' ? 'bg-rose-50 text-rose-600' : 
                         record.status === 'LEAVE' ? 'bg-amber-50 text-amber-600' :
                         'bg-slate-100 text-slate-500'
                       }`}>
                         {record.status === 'PRESENT' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {record.status === 'ABSENT' && <XCircle className="w-3.5 h-3.5" />}
                         {record.status === 'LEAVE' && <AlertCircle className="w-3.5 h-3.5" />}
                         {record.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right space-x-2">
                        <button 
                          onClick={() => handleMark(record.studentId, 'PRESENT')}
                          disabled={isPending}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold"
                        >
                           Present
                        </button>
                        <button 
                          onClick={() => handleMark(record.studentId, 'ABSENT')}
                          disabled={isPending}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-bold"
                        >
                           Absent
                        </button>
                        <button 
                          onClick={() => handleMark(record.studentId, 'LEAVE')}
                          disabled={isPending}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-bold"
                        >
                           Leave
                        </button>
                     </td>
                   </tr>
                 ))}
                 {filteredRecords.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-sm font-medium text-slate-500">
                       No students found matching the criteria.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
