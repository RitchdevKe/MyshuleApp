"use client";

import { useState, useRef } from "react";

type AtRiskStudent = {
  studentId: string;
  name: string;
  admissionNumber: string;
  averageScore: number | null;
  examName: string;
  overallGrade: string | null;
};

type PredictionsData = {
  projectedRevenue: number;
  revenueGrowthPercent: number;
  atRiskStudentsCount: number;
  atRiskStudents: AtRiskStudent[];
};

export default function PredictionsClient({ initialData }: { initialData: PredictionsData }) {
  const [data, setData] = useState<PredictionsData>(initialData);
  const rosterDialogRef = useRef<HTMLDialogElement>(null);
  const compareDialogRef = useRef<HTMLDialogElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Or whatever currency is appropriate
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Financial Prediction Card */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6">
          <h3 className="text-lg font-medium text-white mb-2">Projected Revenue</h3>
          <p className="text-3xl font-bold text-emerald-400">
            {formatCurrency(data.projectedRevenue)}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Based on unpaid invoices.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Expected Conversion Rate
            </span>
            <span className="text-sm font-bold text-white">
              {data.revenueGrowthPercent.toFixed(1)}%
            </span>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                // simple print for now
                window.print();
              }}
              className="w-full rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Export to PDF
            </button>
          </div>
        </div>

        {/* Academic Prediction Card */}
        <div className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6">
          <h3 className="text-lg font-medium text-white mb-2">At-Risk Students</h3>
          <p className="text-3xl font-bold text-rose-400">
            {data.atRiskStudentsCount}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Students predicted to score below passing grade based on current report cards.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => rosterDialogRef.current?.showModal()}
              className="flex-1 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              View at risk roster
            </button>
            <button
              onClick={() => compareDialogRef.current?.showModal()}
              className="flex-1 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Compare to grade
            </button>
          </div>
        </div>
      </div>

      {/* Roster Modal */}
      <dialog
        ref={rosterDialogRef}
        className="w-full max-w-2xl rounded-3xl bg-slate-900 p-0 text-white backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 border border-slate-800"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">At-Risk Student Roster</h3>
            <button
              onClick={() => rosterDialogRef.current?.close()}
              className="text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto pr-2">
            {data.atRiskStudents.length > 0 ? (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Adm No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.atRiskStudents.map((student) => (
                    <tr key={student.studentId} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-white">{student.admissionNumber}</td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3 text-rose-400">{student.averageScore?.toFixed(1) || 'N/A'}</td>
                      <td className="px-4 py-3">{student.overallGrade || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-slate-400 py-8">No at-risk students found.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
             <button
                onClick={() => { window.print(); }}
                className="rounded-full bg-slate-800 px-6 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors mr-2"
              >
                Export
              </button>
             <button
                onClick={() => rosterDialogRef.current?.close()}
                className="rounded-full bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
          </div>
        </div>
      </dialog>

      {/* Compare Modal */}
      <dialog
        ref={compareDialogRef}
        className="w-full max-w-lg rounded-3xl bg-slate-900 p-0 text-white backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 border border-slate-800"
      >
        <div className="p-6">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Grade Comparison</h3>
            <button
              onClick={() => compareDialogRef.current?.close()}
              className="text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-slate-400">
              Comparing at-risk average score against the expected passing grade (50.0).
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Target Grade Average</span>
                <span className="text-white font-bold">50.0</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">At-Risk Group Average</span>
                <span className="text-rose-400 font-bold">
                  {data.atRiskStudents.length > 0 
                    ? (data.atRiskStudents.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / data.atRiskStudents.length).toFixed(1)
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5">
                <div 
                  className="bg-rose-500 h-2.5 rounded-full" 
                  style={{ 
                    width: data.atRiskStudents.length > 0 
                      ? `${Math.min(100, (data.atRiskStudents.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / data.atRiskStudents.length))}%`
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button
                onClick={() => compareDialogRef.current?.close()}
                className="rounded-full bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
