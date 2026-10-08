"use client";

import React, { useState, useTransition } from "react";
import { CheckCircle2, Search, Filter, Save, Loader2 } from "lucide-react";
import { AttendanceStatus } from "@prisma/client";
import { saveDailyAttendance } from "./actions";

type StudentData = {
  id: string;
  admissionNumber: string;
  name: string;
  status: AttendanceStatus;
};

type Props = {
  initialData: {
    streamName: string;
    teacherName: string;
    date: string;
    students: StudentData[];
    termId: string;
    staffId: string;
    streamId: string;
  };
};

export default function DailyAttendanceClient({ initialData }: Props) {
  const [students, setStudents] = useState<StudentData[]>(initialData.students);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: "PRESENT" })));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveDailyAttendance({
        streamId: initialData.streamId,
        termId: initialData.termId,
        staffId: initialData.staffId,
        date: initialData.date,
        records: students.map(s => ({ studentId: s.id, status: s.status }))
      });
      if (result.success) {
        alert("Attendance saved successfully!");
      } else {
        alert("Failed to save attendance: " + result.error);
      }
    });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white/40 p-4 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" /> {initialData.streamName} — Today&apos;s Students
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Teacher: {initialData.teacherName} • Date: {new Date(initialData.date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 shadow-sm w-48"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          
          <button 
            onClick={markAllPresent}
            className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          >
            Mark All Present
          </button>

          <button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100/60">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold">No students found.</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="p-5 flex items-center justify-between hover:bg-white/80 transition-colors group flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100/50 shadow-sm shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-base">{student.name}</div>
                    <div className="text-xs font-bold text-slate-400">{student.admissionNumber}</div>
                  </div>
                </div>
                
                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 w-full md:w-auto overflow-x-auto">
                  <button 
                    onClick={() => handleStatusChange(student.id, "PRESENT")}
                    className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                      student.status === 'PRESENT' 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                    }`}
                  >
                    Present
                  </button>
                  <button 
                    onClick={() => handleStatusChange(student.id, "ABSENT")}
                    className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                      student.status === 'ABSENT' 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                    }`}
                  >
                    Absent
                  </button>
                  <button 
                    onClick={() => handleStatusChange(student.id, "LATE")}
                    className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                      student.status === 'LATE' 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                    }`}
                  >
                    Late
                  </button>
                  <button 
                    onClick={() => handleStatusChange(student.id, "EXCUSED")}
                    className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                      student.status === 'EXCUSED' 
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
                    }`}
                  >
                    Excused
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
