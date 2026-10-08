'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function ResultsAccordion({ results }: { results: any[] }) {
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  if (!results || results.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-8">
      <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Subject Breakdown</h4>
      {results.map((result) => {
        const isOpen = openSubject === result.id;
        return (
          <div key={result.id} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all">
            <button 
              onClick={() => setOpenSubject(isOpen ? null : result.id)}
              className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl text-primary-700 dark:text-primary-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-100">{result.subject?.name}</h5>
                  <p className="text-xs text-slate-500 font-medium">{result.gradeRange?.gradeLabel || 'Grade'} - {result.numericScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-lg text-slate-800 dark:text-slate-100">{result.numericScore}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </button>
            
            {isOpen && (
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Teacher's Remarks</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      "{result.teacherRemarks || result.gradeRange?.defaultRemarks || 'No remarks provided.'}"
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-slate-500">Subject Code</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{result.subject?.code}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
