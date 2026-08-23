import React, { useState } from 'react';
import { FileText, Download, Printer, Search } from 'lucide-react';
import { Student } from '../types.ts';

interface ReportFormsTabProps {
  students: Student[];
}

export function ReportFormsTab({ students }: ReportFormsTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState('Term 1, 2026');
  const [rosterQuery, setRosterQuery] = useState('');
  
  const activeStudent = students.find(s => s.id === selectedStudentId);

  const filteredRoster = students.filter(s =>
    s.name.toLowerCase().includes(rosterQuery.toLowerCase()) || s.id.toLowerCase().includes(rosterQuery.toLowerCase())
  );

  // Simulated scores formula (consistent with Parent/StudentPortal)
  const getSubjectScores = (studId: string) => {
    let seed = 0;
    for (let i = 0; i < studId.length; i++) seed += studId.charCodeAt(i);

    const scores = [
      { subject: 'Mathematics', score: Math.floor((seed * 7) % 55 + 40) },
      { subject: 'English', score: Math.floor((seed * 11) % 45 + 50) },
      { subject: 'Kiswahili', score: Math.floor((seed * 13) % 40 + 55) },
      { subject: 'Biology', score: Math.floor((seed * 17) % 50 + 45) },
      { subject: 'Chemistry', score: Math.floor((seed * 19) % 45 + 45) },
      { subject: 'Physics', score: Math.floor((seed * 23) % 40 + 50) },
    ];

    const total = scores.reduce((sum, s) => sum + s.score, 0);
    const average = Math.round(total / scores.length);
    
    let meanGrade = 'D';
    if (average >= 80) meanGrade = 'A';
    else if (average >= 75) meanGrade = 'A-';
    else if (average >= 70) meanGrade = 'B+';
    else if (average >= 65) meanGrade = 'B';
    else if (average >= 60) meanGrade = 'B-';
    else if (average >= 55) meanGrade = 'C+';
    else if (average >= 50) meanGrade = 'C';
    else if (average >= 45) meanGrade = 'C-';
    else if (average >= 40) meanGrade = 'D+';

    return { scores, total, average, meanGrade };
  };

  const results = activeStudent ? getSubjectScores(activeStudent.id) : null;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--color-secondary)]" />
          <h2 className="text-base font-semibold text-slate-800">E-Report Forms</h2>
        </div>

        <div className="flex items-center justify-end w-full sm:w-auto gap-2">
          <select 
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-xs font-medium text-slate-700 cursor-pointer transition"
          >
            <option>Term 1, 2026</option>
            <option>Term 3, 2025</option>
            <option>Term 2, 2025</option>
            <option>Term 1, 2025</option>
          </select>
          <div className="relative">
             <input
               type="text"
               placeholder="Search roster..."
               value={rosterQuery}
               onChange={e => setRosterQuery(e.target.value)}
               className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition w-44"
             />
             <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         {/* Student Selection List */}
         <div className="lg:col-span-1 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-2 shadow-sm overflow-hidden flex flex-col h-[560px]">
           <div className="px-2 py-2 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">Class Roster</div>
           <div className="overflow-y-auto flex-1 space-y-0.5 p-1">
             {filteredRoster.map(s => (
               <button 
                 key={s.id}
                 onClick={() => setSelectedStudentId(s.id)}
                 className={`w-full text-left px-2.5 py-2 rounded-lg transition flex flex-col gap-0.5 cursor-pointer border-none ${
                   selectedStudentId === s.id ? 'bg-indigo-50 shadow-sm' : 'hover:bg-slate-50 bg-transparent'
                 }`}
               >
                 <span className={`text-sm font-semibold truncate ${selectedStudentId === s.id ? 'text-indigo-700' : 'text-slate-700'}`}>{s.name}</span>
                 <span className="text-[11px] font-normal text-slate-400 truncate tabular-nums">{s.id} • F{s.form}{s.stream}</span>
               </button>
             ))}
             {filteredRoster.length === 0 && (
               <div className="text-center text-xs text-slate-400 py-6">No matches</div>
             )}
           </div>
         </div>

         {/* Report Card Viewer */}
         <div className="lg:col-span-3">
           {activeStudent && results ? (
             <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-6 sm:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
               
               <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-5">
                 <div>
                   <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Karega Secondary</h1>
                   <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-wide">Official Academic Transcript</p>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg inline-block">{selectedTerm}</div>
                 </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
                 <div>
                   <span className="text-[11px] uppercase font-medium text-slate-400 block tracking-wide">Candidate Name</span>
                   <span className="text-sm font-semibold text-slate-800">{activeStudent.name}</span>
                 </div>
                 <div>
                   <span className="text-[11px] uppercase font-medium text-slate-400 block tracking-wide">Admission No</span>
                   <span className="text-sm font-semibold text-slate-800 tabular-nums">{activeStudent.id}</span>
                 </div>
                 <div>
                   <span className="text-[11px] uppercase font-medium text-slate-400 block tracking-wide">Form & Stream</span>
                   <span className="text-sm font-semibold text-slate-800">Form {activeStudent.form} {activeStudent.stream}</span>
                 </div>
                 <div>
                   <span className="text-[11px] uppercase font-medium text-slate-400 block tracking-wide">Gender</span>
                   <span className="text-sm font-semibold text-slate-800">{activeStudent.gender === 'M' ? 'Male' : 'Female'}</span>
                 </div>
               </div>

               <table className="w-full text-left mb-6">
                 <thead>
                   <tr className="bg-slate-900 text-white text-xs uppercase tracking-wide font-medium">
                     <th className="px-4 py-2.5 rounded-tl-lg">Subject</th>
                     <th className="px-4 py-2.5 text-center">Score</th>
                     <th className="px-4 py-2.5 text-center">Grade</th>
                     <th className="px-4 py-2.5 rounded-tr-lg">Remarks</th>
                   </tr>
                 </thead>
                 <tbody className="border-x border-b border-slate-200 divide-y divide-slate-200">
                   {results.scores.map((s, idx) => {
                     let grade = 'D';
                     if (s.score >= 80) grade = 'A';
                     else if (s.score >= 75) grade = 'A-';
                     else if (s.score >= 70) grade = 'B+';
                     else if (s.score >= 65) grade = 'B';
                     else if (s.score >= 60) grade = 'B-';
                     else if (s.score >= 55) grade = 'C+';
                     else if (s.score >= 50) grade = 'C';
                     else if (s.score >= 45) grade = 'C-';
                     else if (s.score >= 40) grade = 'D+';
                     
                     let remark = "Room for Improvement";
                     if (grade.startsWith('A')) remark = "Excellent Performance";
                     else if (grade.startsWith('B')) remark = "Good Effort";
                     else if (grade.startsWith('C')) remark = "Average, Try Harder";
                     
                     return (
                       <tr key={idx} className="hover:bg-slate-50 text-sm font-medium text-slate-700">
                         <td className="px-4 py-2.5">{s.subject}</td>
                         <td className="px-4 py-2.5 text-center tabular-nums">{s.score}%</td>
                         <td className="px-4 py-2.5 text-center text-indigo-600 font-semibold">{grade}</td>
                         <td className="px-4 py-2.5 text-slate-400 font-normal text-xs">{remark}</td>
                       </tr>
                     );
                   })}
                 </tbody>
                 <tfoot>
                   <tr className="bg-slate-100 border border-slate-200 border-t-0 text-sm font-semibold text-slate-900 uppercase">
                     <td className="px-4 py-3">Total & Overall Mean</td>
                     <td className="px-4 py-3 text-center tabular-nums">{results.total} / {results.scores.length * 100}</td>
                     <td className="px-4 py-3 text-center text-[var(--color-secondary)] text-lg">{results.meanGrade}</td>
                     <td className="px-4 py-3 text-slate-500 text-xs normal-case">Promoted to Next Level</td>
                   </tr>
                 </tfoot>
               </table>

               <div className="flex justify-end gap-2 print:hidden">
                 <button className="px-3.5 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium text-sm hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer">
                   <Printer className="w-3.5 h-3.5" /> Print Form
                 </button>
                 <button className="px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg font-medium text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer border-none">
                   <Download className="w-3.5 h-3.5" /> Download PDF
                 </button>
               </div>
             </div>
           ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 h-full rounded-[1.5rem] flex items-center justify-center text-slate-400 font-medium text-sm p-8 text-center">
               Select a candidate from the roster to view their report form
             </div>
           )}
         </div>
      </div>
    </div>
  );
}
