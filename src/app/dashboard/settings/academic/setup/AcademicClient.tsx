"use client";

import React, { useState } from "react";
import { BookOpen, Calendar, Award, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AcademicClient({ years, gradingScales }: { years: any[]; gradingScales: any[] }) {
  const [activeYear, setActiveYear] = useState(years[0]?.id || "");

  const activeYearData = years.find((y) => y.id === activeYear);
  const terms = activeYearData?.terms || [];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-6 border-b border-slate-200/60 bg-slate-50/50">
         <h2 className="text-xl font-black text-slate-800">Academic Setup Overview</h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Review academic years, terms/semesters, and global grading scales.</p>
      </div>

      <div className="p-6 space-y-8">
         {/* Academic Years */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" /> Academic Years
               </h3>
               <Link href="/dashboard/settings/academic/calendar" className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">+ Manage Calendar</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {years.length === 0 && <p className="text-sm text-slate-500">No academic years found.</p>}
               {years.map((year) => (
                  <div key={year.id} className={`border rounded-2xl p-5 relative transition-all cursor-pointer ${
                     activeYear === year.id 
                     ? 'bg-primary-900 border-primary-900 text-white shadow-md' 
                     : 'bg-white border-slate-200 hover:border-primary-300'
                  }`} onClick={() => setActiveYear(year.id)}>
                     {activeYear === year.id && (
                        <div className="absolute top-3 right-3 text-secondary-500">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                     )}
                     <h4 className={`text-lg font-black mb-1 ${activeYear === year.id ? 'text-white' : 'text-slate-800'}`}>{year.name}</h4>
                     <p className={`text-xs font-medium ${activeYear === year.id ? 'text-primary-200' : 'text-slate-500'}`}>
                        {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Terms / Semesters */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" /> Terms & Semesters
               </h3>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Term Name</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</th>
                        <th className="py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {terms.length === 0 && (
                        <tr><td colSpan={4} className="py-4 text-center text-sm text-slate-500">No terms found for this year.</td></tr>
                     )}
                     {terms.map((term: any) => (
                        <tr key={term.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="py-3 px-5 font-bold text-sm text-slate-800">{term.name}</td>
                           <td className="py-3 px-5 text-sm font-medium text-slate-600">{new Date(term.startDate).toLocaleDateString()}</td>
                           <td className="py-3 px-5 text-sm font-medium text-slate-600">{new Date(term.endDate).toLocaleDateString()}</td>
                           <td className="py-3 px-5">
                              {term.isActiveTerm ? (
                                 <span className="inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-700">Active</span>
                              ) : (
                                 <span className="inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-600">Inactive</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Global Grading Scale */}
         <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400" /> Global Grading Scale
               </h3>
               <Link href="/dashboard/settings/academic/grading" className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">Manage Scales</Link>
            </div>
            
            {gradingScales.length === 0 && <p className="text-sm text-slate-500 mb-4">No grading scales found.</p>}
            {gradingScales.map((scale) => (
              <div key={scale.id} className="mb-4">
                <h4 className="text-sm font-bold text-slate-800 mb-2">{scale.name} ({scale.scaleType})</h4>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-wrap gap-4 items-center">
                  {scale.ranges.map((range: any, idx: number) => (
                    <React.Fragment key={range.id}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-xl">{range.gradeLabel}</div>
                        <div className="text-sm font-bold text-slate-700">{range.minScore} - {range.maxScore}</div>
                      </div>
                      {idx < scale.ranges.length - 1 && <div className="w-px h-8 bg-slate-200 mx-2"></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 p-3 rounded-lg w-fit shadow-sm">
               <AlertCircle className="w-4 h-4 text-slate-400" />
               Departments can override this global scale if necessary.
            </div>
         </div>

      </div>
    </div>
  );
}
