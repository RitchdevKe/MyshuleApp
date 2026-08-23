"use client";
import React from "react";
import { Briefcase, BookOpen, Clock, Award, Star } from "lucide-react";

export default function AcademicTeachersTab() {
  const teacherPerformance = [
    { name: "Mr. Omondi", subject: "Mathematics", classes: 4, avgScore: 78.4, coverage: 92, rating: 4.8 },
    { name: "Mrs. Kimani", subject: "English", classes: 3, avgScore: 82.1, coverage: 98, rating: 4.9 },
    { name: "Ms. Patel", subject: "Science", classes: 5, avgScore: 71.5, coverage: 85, rating: 4.2 },
    { name: "Mr. Wanjala", subject: "History", classes: 4, avgScore: 68.2, coverage: 76, rating: 3.8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-lg font-black text-slate-800">Teacher Effectiveness</h2>
            <p className="text-sm text-slate-500">Analyze staff performance, syllabus coverage, and class outcomes.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
               <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">24:1</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student-Teacher Ratio</div>
            <div className="text-xs text-emerald-600 font-bold mt-2">Optimal Range</div>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
               <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">87%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg. Syllabus Coverage</div>
            <div className="text-xs text-slate-500 font-medium mt-2">Target: 95% by Term End</div>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
               <Clock className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">98.2%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Staff Attendance</div>
            <div className="text-xs text-slate-500 font-medium mt-2">This Term</div>
         </div>
         
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" /> Performance by Educator
               </h3>
               <p className="text-xs text-slate-500 mt-1">Class average scores and coverage metrics per teacher.</p>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Educator Name</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Focus</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Classes Assigned</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Avg. Class Score</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Syllabus Coverage</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Rating</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {teacherPerformance.map((teacher, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 font-bold text-slate-800 text-sm">{teacher.name}</td>
                        <td className="p-4 text-sm font-medium text-slate-600">{teacher.subject}</td>
                        <td className="p-4 text-center text-sm font-black text-slate-700">{teacher.classes}</td>
                        <td className="p-4 text-center text-sm font-black text-indigo-600">{teacher.avgScore}%</td>
                        <td className="p-4 text-center">
                           <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                              <div className={`h-1.5 rounded-full ${teacher.coverage >= 90 ? 'bg-emerald-500' : teacher.coverage >= 80 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${teacher.coverage}%` }}></div>
                           </div>
                           <div className="text-[10px] font-bold text-slate-500 mt-1">{teacher.coverage}%</div>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-1 text-sm font-black text-slate-800">
                              {teacher.rating} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
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
