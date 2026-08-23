"use client";
import React, { useState, useEffect } from "react";
import { Search, User, Phone, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { getStudents, sendNoticeToParent } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentData = any;

export default function StudentAttendanceTab() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [noticeSent, setNoticeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      const data = await getStudents();
      setStudents(data || []);
      setLoading(false);
    }
    loadStudents();
  }, []);

  const handleSendNotice = async (studentId: string, parentContact: string) => {
    setIsSending(true);
    await sendNoticeToParent(studentId, parentContact);
    setNoticeSent(true);
    setIsSending(false);
    setTimeout(() => setNoticeSent(false), 3000);
  };

  const calculateAttendanceRate = (records: StudentData[]) => {
    if (!records || records.length === 0) return null;
    const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
    return Math.round((presentCount / records.length) * 100);
  };

  const getAttendanceColor = (rate: number | null) => {
    if (rate === null) return 'bg-slate-50 text-slate-600';
    if (rate > 90) return 'bg-emerald-50 text-emerald-600';
    if (rate > 80) return 'bg-amber-50 text-amber-600';
    return 'bg-rose-50 text-rose-600';
  };

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) || 
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Determine latest attendance patterns mock logic
  const lateCount = selectedStudent?.attendanceRecords?.filter((r: StudentData) => r.status === 'LATE').length || 0;
  const hasLatePattern = lateCount > 0;

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6">
      
      {/* Sidebar: Student Search */}
      <div className="w-full md:w-1/3 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm p-4 flex flex-col min-h-[500px]">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Find Student</h3>
        
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or ADM..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-sm font-bold text-slate-400 py-8">
              No students found.
            </div>
          ) : (
            filteredStudents.map(student => {
              const rate = calculateAttendanceRate(student.attendanceRecords);
              const isActive = student.id === selectedStudentId;
              const grade = student.enrollments?.[0]?.class?.name || "N/A";
              
              return (
                <div 
                  key={student.id} 
                  onClick={() => { setSelectedStudentId(student.id); setNoticeSent(false); }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive 
                    ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/20' 
                    : 'bg-white/60 border-transparent hover:bg-white/80 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      {student.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{student.firstName} {student.lastName}</div>
                      <div className="text-[10px] font-bold text-slate-400">{student.admissionNumber} • {grade}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-black px-2 py-1 rounded-lg ${getAttendanceColor(rate)}`}>
                    {rate !== null ? `${rate}%` : 'N/A'}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Content: Student Details */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        {selectedStudent ? (
          <>
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl shadow-lg flex items-center justify-center text-4xl font-black">
                {selectedStudent.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="text-sm font-bold text-indigo-600">
                      {selectedStudent.enrollments?.[0]?.class?.name || "No Class"} • {selectedStudent.admissionNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600">
                      {calculateAttendanceRate(selectedStudent.attendanceRecords) !== null 
                        ? `${calculateAttendanceRate(selectedStudent.attendanceRecords)}%` 
                        : 'N/A'}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Yearly Attendance</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {selectedStudent.parents && selectedStudent.parents.length > 0 ? (
                    selectedStudent.parents.map((p: StudentData) => (
                      <div key={p.parent.id} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-200/50">
                        <User className="w-4 h-4 text-slate-400" /> {p.parent.firstName} {p.parent.lastName} ({p.relationship.toLowerCase()})
                        <span className="text-slate-300 mx-1">|</span>
                        <Phone className="w-4 h-4 text-slate-400" /> {p.parent.phonePrimary}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-bold text-slate-400">No parent details found.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Recent Records</h3>
                <div className="space-y-3">
                  {selectedStudent.attendanceRecords && selectedStudent.attendanceRecords.length > 0 ? (
                    selectedStudent.attendanceRecords.map((record: StudentData) => {
                      const dateObj = new Date(record.register?.date);
                      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
                      let color = "text-slate-600 bg-slate-50";
                      if (record.status === 'PRESENT') color = "text-emerald-600 bg-emerald-50";
                      if (record.status === 'LATE') color = "text-amber-600 bg-amber-50";
                      if (record.status === 'ABSENT') color = "text-rose-600 bg-rose-50";
                      if (record.status === 'EXCUSED') color = "text-blue-600 bg-blue-50";

                      return (
                        <div key={record.id} className="flex justify-between items-center p-3 bg-white/80 border border-slate-100 rounded-xl shadow-sm">
                          <span className="text-sm font-bold text-slate-700">{dateStr}</span>
                          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg ${color}`}>{record.status}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-sm font-bold text-slate-400">No recent attendance records.</div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50/50 backdrop-blur-md rounded-3xl border border-amber-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Attendance Patterns
                </h3>
                <div className="space-y-4">
                  {hasLatePattern ? (
                    <>
                      <div className="p-4 bg-white/80 border border-amber-200 rounded-2xl shadow-sm">
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.firstName} has been <span className="text-amber-600">Late</span> {lateCount} times recently.</p>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Please review their arrival time and notify the parent if necessary.</p>
                      </div>
                      
                      <button 
                        onClick={() => handleSendNotice(selectedStudent.id, selectedStudent.parents?.[0]?.parent?.phonePrimary || "No phone")}
                        disabled={isSending || noticeSent}
                        className={`w-full py-3 flex items-center justify-center gap-2 text-white text-sm font-bold rounded-xl shadow-md transition-colors ${
                          noticeSent 
                          ? 'bg-emerald-500 shadow-emerald-500/20' 
                          : 'bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700'
                        } disabled:opacity-50`}
                      >
                        {isSending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : noticeSent ? (
                          <><CheckCircle className="w-5 h-5" /> Notice Sent</>
                        ) : (
                          "Send Notice to Parent"
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="p-4 bg-white/80 border border-emerald-200 rounded-2xl shadow-sm">
                      <p className="text-sm font-bold text-slate-700">No concerning attendance patterns detected.</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">Student&apos;s attendance is regular.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/30 rounded-3xl border border-white/50 backdrop-blur-sm">
            <Search className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-bold">Select a student to view details.</p>
          </div>
        )}
      </div>

    </div>
  );
}
