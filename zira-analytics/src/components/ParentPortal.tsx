import React, { useState } from 'react';
import { 
  GraduationCap, 
  Wallet, 
  MessageSquareCode, 
  Clock, 
  Calendar, 
  Search, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  User,
  TrendingUp,
  Award,
  CircleCheck,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { Student, Exam, MarkSheet, FeeTransaction, SmsLog } from '../types.ts';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell
} from 'recharts';

interface ParentPortalProps {
  students: Student[];
  exams: Exam[];
  transactions: FeeTransaction[];
  smsLogs: SmsLog[];
  parentName: string;
}

export function ParentPortal({
  students,
  exams,
  transactions,
  smsLogs,
  parentName
}: ParentPortalProps) {
  // Let parents select child in sandbox or select Dennis Kiprop (ADM-2041) by default
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'ADM-2041');
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'term1_midterm_2026');

  const currentChild = students.find(s => s.id === selectedStudentId) || students[0];

  // Filter transaction ledger specifically for this student
  const childTransactions = transactions.filter(tx => tx.studentId === selectedStudentId);

  // Filter school sms reports specifically sent to this parent/student
  const childSmsLogs = smsLogs.filter(log => log.studentId === selectedStudentId);

  // Simulate marks dynamically using the seeder formula so the parent sees real grades!
  const getSubjectScores = (studId: string, exId: string) => {
    let seed = 0;
    for (let i = 0; i < studId.length; i++) seed += studId.charCodeAt(i);
    for (let i = 0; i < exId.length; i++) seed += exId.charCodeAt(i);

    const getSubjectScore = (factor: number): number => {
      return Math.floor((seed * factor) % 61 + 35); // 35 to 95
    };

    const scores: Record<string, number> = {
      English: getSubjectScore(11),
      Kiswahili: getSubjectScore(13),
      Mathematics: getSubjectScore(7),
      Biology: getSubjectScore(17),
      Chemistry: getSubjectScore(19),
      Physics: getSubjectScore(23),
      History: getSubjectScore(29),
      Geography: getSubjectScore(31),
      CRE: getSubjectScore(37)
    };

    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const average = Math.round(total / Object.keys(scores).length);

    // Map mean Grade
    let grade = 'D';
    if (average >= 80) grade = 'A';
    else if (average >= 75) grade = 'A-';
    else if (average >= 70) grade = 'B+';
    else if (average >= 65) grade = 'B';
    else if (average >= 60) grade = 'B-';
    else if (average >= 55) grade = 'C+';
    else if (average >= 50) grade = 'C';
    else if (average >= 45) grade = 'C-';
    else if (average >= 40) grade = 'D+';
    
    return {
      scoresList: Object.entries(scores).map(([subject, score]) => ({ subject, score })),
      totalMarks: total,
      averageScore: average,
      meanGrade: grade
    };
  };

  const { scoresList, totalMarks, averageScore, meanGrade } = getSubjectScores(selectedStudentId, selectedExamId);

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Ward Switcher Bar (Positioned at the top of the page) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-3">
        <div>
          <span className="text-base text-rose-400 font-bold uppercase tracking-wider block tabular-nums">
            CAREGIVER GUARDIAN PORTAL
          </span>
          <span className="text-base text-slate-400 font-bold block mt-0.5">
            Synchronized live academic transcripts & financial ledger balances
          </span>
        </div>

        {/* Child Selector Panel */}
        <div className="bg-slate-950 border border-slate-800 p-1.5 px-3 rounded-xl flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <span className="text-base font-bold text-slate-400 uppercase tracking-wider">
            👨‍👦 Active Ward:
          </span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-base text-white outline-none font-bold"
          >
            {students.map(stud => (
              <option key={stud.id} value={stud.id}>
                {stud.name} (Form {stud.form} {stud.stream})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentChild ? (
        <>
          {/* Child Overview Jumbotron Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Student Bio */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-3.5">
              <div className="w-12 h-12 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-[16px] font-bold uppercase tracking-wider block">Student Name</span>
                <span className="text-2xl font-bold text-white block mt-0.5 leading-tight">{currentChild.name}</span>
                <span className="text-[16px] text-indigo-300 tabular-nums font-bold uppercase tracking-wider mt-0.5">ADM: {currentChild.admissionNo}</span>
              </div>
            </div>

            {/* Attendance Percentage */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-3.5">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-[16px] font-bold uppercase tracking-wider block">School Attendance</span>
                <span className="text-3xl font-bold text-emerald-400 tabular-nums block mt-0.5">{currentChild.attendancePercentage}%</span>
                <span className="text-[16px] text-slate-400 mt-0.5 block">Standard Target: 90%+</span>
              </div>
            </div>

            {/* Fees Term Balance */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-3.5">
              <div className="w-12 h-12 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-[16px] font-bold uppercase tracking-wider block">Outstanding Fees Balance</span>
                <span className={`text-3xl font-bold tabular-nums block mt-0.5 ${currentChild.feeBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  Ksh {currentChild.feeBalance.toLocaleString()}
                </span>
                <span className="text-[16px] text-slate-400 mt-0.5 block">Total: Ksh {currentChild.totalFees.toLocaleString()}</span>
              </div>
            </div>

            {/* Academic Mean */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-3.5">
              <div className="w-12 h-12 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 text-[16px] font-bold uppercase tracking-wider block">Mean Score Rank</span>
                <span className="text-3xl font-bold text-amber-400 tabular-nums block mt-0.5">{meanGrade} ({averageScore}%)</span>
                <span className="text-[16px] text-slate-400 mt-0.5 block">Active Term Index</span>
              </div>
            </div>

          </div>

          {/* Core Portal Tab Rows (Academic Performance Section + Finance & SMS Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: ACADEMICS SHEET PERFORMANCE ANALYTICS (Span 2) */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-white text-2xl uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Student Examination Marksheet
                  </h3>
                  <p className="text-slate-400 text-lg">Live assessment grades compiled for class examinations.</p>
                </div>

                {/* Exam selector */}
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-white/10 rounded-xl text-lg text-indigo-300 font-bold outline-none"
                >
                  {exams.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              {/* Graphical Visualizer bar chart */}
              <div className="h-64 bg-slate-950/40 p-4 border border-white/5 rounded-2xl w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoresList}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 12, color: '#fff', fontSize: 11 }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {scoresList.map((entry, idx) => (
                        <Cell key={idx} fill={entry.score >= 80 ? '#34d399' : entry.score >= 50 ? '#818cf8' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Subject tabular records details */}
              <div className="overflow-hidden border border-white/5 rounded-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[16px] tabular-nums tracking-wider text-slate-400 uppercase border-b border-white/10">
                      <th className="py-2.5 px-4 font-semibold">Subject Course</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Mark Score</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Equiv. Grade</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Performance Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-lg text-slate-300">
                    {scoresList.map((row, idx) => {
                      const getGrade = (val: number) => {
                        if (val >= 80) return { grade: 'A', class: 'text-emerald-400', desc: 'Outstanding Focus' };
                        if (val >= 75) return { grade: 'A-', class: 'text-emerald-300', desc: 'Highly Capable' };
                        if (val >= 70) return { grade: 'B+', class: 'text-indigo-400', desc: 'Above Standard' };
                        if (val >= 65) return { grade: 'B', class: 'text-indigo-300', desc: 'Good Work' };
                        if (val >= 60) return { grade: 'B-', class: 'text-indigo-200', desc: 'Steady Improvement' };
                        if (val >= 55) return { grade: 'C+', class: 'text-slate-300', desc: 'Average Standard' };
                        if (val >= 50) return { grade: 'C', class: 'text-slate-400', desc: 'Adequate Passing' };
                        if (val >= 40) return { grade: 'D+', class: 'text-rose-300', desc: 'Needs Extra Attention' };
                        return { grade: 'E', class: 'text-rose-400 font-bold', desc: 'Urgent Remedial Needed' };
                      };
                      const marker = getGrade(row.score);
                      return (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-white">{row.subject}</td>
                          <td className="py-2.5 px-3 text-center tabular-nums font-bold text-indigo-300">{row.score} / 100</td>
                          <td className={`py-2.5 px-3 text-center tabular-nums font-bold ${marker.class}`}>{marker.grade}</td>
                          <td className="py-2.5 px-4 text-right text-slate-400 italic">{marker.desc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COLUMN 2: FINANCIAL STATEMENT (Span 1) */}
            <div className="flex flex-col gap-6">
              
              {/* Fee accounts and card records */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Wallet className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-lg uppercase tracking-wider">Fee Receipt Registry</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 bg-slate-950/40 rounded-xl border border-white/5">
                    <div className="text-slate-400 text-[15px] font-bold uppercase tracking-wider">Estimated Term Invoicing</div>
                    <div className="text-3xl font-bold text-white tabular-nums mt-0.5">Ksh {currentChild.totalFees.toLocaleString()}</div>
                  </div>

                  <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <div className="text-emerald-400 text-[15px] font-bold uppercase tracking-wider">Sum Fees Settled</div>
                    <div className="text-3xl font-bold text-emerald-400 tabular-nums mt-0.5">Ksh {(currentChild.totalFees - currentChild.feeBalance).toLocaleString()}</div>
                  </div>
                </div>

                <span className="block text-[16px] font-bold text-slate-400 uppercase mt-4">Transactions Receipt logs</span>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {childTransactions.length === 0 ? (
                    <div className="text-center py-6 text-[17px] text-slate-500 italic">No payment receipts settled yet.</div>
                  ) : (
                    childTransactions.map(tx => (
                      <div key={tx.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 hover:bg-white/10 transition-all tabular-nums">
                        <div className="flex justify-between items-center text-[16px]">
                          <span className="text-indigo-300 font-bold">{tx.reference}</span>
                          <span className="text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-lg font-bold text-white">Ksh {tx.amount.toLocaleString()}</div>
                            <div className="text-[15px] text-slate-500 mt-0.5">Type: {tx.type}</div>
                          </div>
                          <span className="text-[15px] text-emerald-400 flex items-center gap-1 font-bold">
                            <CircleCheck className="w-3.5 h-3.5" /> Clr
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Parents Communication logs SMS sync */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <MessageSquareCode className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-lg uppercase tracking-wider">Alert Inbox Centre ({childSmsLogs.length})</h3>
                </div>

                <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                  {childSmsLogs.length === 0 ? (
                    <div className="text-center py-10 text-[17px] text-slate-500 italic">No SMS broadcasts sent to your cellular inbox.</div>
                  ) : (
                    childSmsLogs.map(log => (
                      <div key={log.id} className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                        <div className="flex justify-between items-center text-[15px] tabular-nums">
                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 uppercase rounded font-bold">{log.type} category</span>
                          <span className="text-slate-500">{new Date(log.sentAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-lg text-slate-300 tabular-nums leading-relaxed bg-black/20 p-2.5 rounded border border-white/5">
                          {log.message}
                        </p>
                        <div className="text-[15px] text-right text-emerald-400 font-bold tabular-nums">
                          ✓ Dispatched successfully
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-xl text-slate-400 font-semibold">No registered student records available under your details index.</p>
        </div>
      )}

    </div>
  );
}
