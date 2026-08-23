import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Search, 
  Smartphone, 
  Check, 
  Clock
} from 'lucide-react';
import { Student } from '../types.ts';

interface StudentAttendanceTabProps {
  students: Student[];
}

export function StudentAttendanceTab({ students }: StudentAttendanceTabProps) {
  const [selectedForm, setSelectedForm] = useState('All');
  const [selectedStream, setSelectedStream] = useState('All');
  const [attendanceDate, setAttendanceDate] = useState('2026-06-02');
  const [searchQuery, setSearchQuery] = useState('');

  const [registerStatus, setRegisterStatus] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(() => {
    const initialState: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    students.forEach(s => {
      initialState[s.id] = 'Present';
    });
    return initialState;
  });

  const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    setRegisterStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleSaveRegister = () => {
    toast.success("Attendance sheet saved. SMS reports compiled for absentees.");
  };

  const handleTriggerAbsenteeSms = () => {
    const absentees = students.filter(s => registerStatus[s.id] === 'Absent');
    if (absentees.length === 0) {
      toast.success("No students marked absent. SMS broadcast skipped.");
      return;
    }
    const names = absentees.map(a => a.name).join(', ');
    toast.success(`Dispatched ${absentees.length} absentee alerts to parents: ${names}`);
  };

  const filteredStudents = students.filter(s => {
    const formMatch = selectedForm === 'All' || String(s.form) === selectedForm;
    const streamMatch = selectedStream === 'All' || s.stream === selectedStream;
    const searchMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery);
    return formMatch && streamMatch && searchMatch;
  });

  const total = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => registerStatus[s.id] === 'Present' || !registerStatus[s.id]).length;
  const absentCount = filteredStudents.filter(s => registerStatus[s.id] === 'Absent').length;
  const lateCount = filteredStudents.filter(s => registerStatus[s.id] === 'Late').length;
  const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  return (
    <div className="space-y-4">

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Present</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{presentCount}</p>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Absent</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{absentCount}</p>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Late</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{lateCount}</p>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{percentage}%</p>
        </div>
      </div>

      {/* Main register */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">

        {/* Filter bar */}
        <div className="p-4 flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 transition"
              />
            </div>

            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
            >
              <option value="All">All Forms</option>
              <option value="1">Form 1</option>
              <option value="2">Form 2</option>
              <option value="3">Form 3</option>
              <option value="4">Form 4</option>
            </select>

            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition"
            >
              <option value="All">All Streams</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>

            <div className="relative min-w-[200px] flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            <button
              onClick={handleTriggerAbsenteeSms}
              className="flex-1 xl:flex-none justify-center px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium rounded-lg transition border border-slate-200 flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" /> SMS Absentees
            </button>
            <button
              onClick={handleSaveRegister}
              className="flex-1 xl:flex-none justify-center px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium rounded-lg transition flex items-center gap-1.5 text-xs cursor-pointer border-none shadow-sm"
            >
              Save Register
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">ADM No.</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Name</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Class</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                    No candidates found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => {
                  const currentStatus = registerStatus[stud.id] || 'Present';
                  return (
                    <tr key={stud.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 tabular-nums text-slate-400 text-xs">{stud.id}</td>
                      <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{stud.name}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-sm">Form {stud.form} {stud.stream}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end items-center gap-1.5">
                          {(['Present', 'Late', 'Absent'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(stud.id, st)}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer border ${
                                currentStatus === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : st === 'Absent'
                                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                                  : 'bg-white hover:bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
