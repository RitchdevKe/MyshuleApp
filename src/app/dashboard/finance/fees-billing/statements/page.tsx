"use client";

import React, { useState, useEffect } from "react";
import { FileSpreadsheet, ArrowLeft, Printer, Loader2 } from "lucide-react";
import { getStudents, getStudentStatement, Transaction } from "./actions";

export default function StatementsPage() {
  const [view, setView] = useState<"home" | "single">("home");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [statement, setStatement] = useState<Transaction[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingStatement, setLoadingStatement] = useState(false);

  useEffect(() => {
    if (view === "single" && students.length === 0) {
      setLoadingStudents(true);
      getStudents().then((data) => {
        setStudents(data);
        setLoadingStudents(false);
      });
    }
  }, [view, students.length]);

  useEffect(() => {
    if (selectedStudentId) {
      setLoadingStatement(true);
      getStudentStatement(selectedStudentId).then((data) => {
        setStatement(data);
        setLoadingStatement(false);
      });
    } else {
      setStatement([]);
    }
  }, [selectedStudentId]);

  if (view === "home") {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <FileSpreadsheet className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Statement of Account</h3>
        <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">Generate and print detailed transactional statements for students over a specific date range.</p>
        <div className="flex justify-center gap-3">
           <button 
             onClick={() => setView("single")}
             className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              Single Student
           </button>
           <button className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-not-allowed opacity-70">
              Batch Generate Class
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setView("home"); setSelectedStudentId(""); }}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Student Statement</h2>
            <p className="text-sm text-slate-500">Select a student to view their financial history</p>
          </div>
        </div>
        
        {selectedStudentId && statement.length > 0 && (
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Statement
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6">
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Student</label>
          <div className="relative">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              disabled={loadingStudents}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none appearance-none font-medium text-slate-700 disabled:opacity-50"
            >
              <option value="">-- Choose a student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </select>
            {loadingStudents && (
              <div className="absolute right-3 top-3.5">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {loadingStatement ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm font-medium">Generating statement...</p>
          </div>
        ) : selectedStudentId ? (
          statement.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80">
                    <th className="px-4 py-3 text-sm font-bold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-sm font-bold text-slate-700">Reference</th>
                    <th className="px-4 py-3 text-sm font-bold text-slate-700">Description</th>
                    <th className="px-4 py-3 text-sm font-bold text-slate-700 text-right">Debit</th>
                    <th className="px-4 py-3 text-sm font-bold text-slate-700 text-right">Credit</th>
                    <th className="px-4 py-3 text-sm font-bold text-slate-700 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statement.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                        {t.ref}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold mr-2 ${
                          t.type === 'INVOICE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.type}
                        </span>
                        {t.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-right font-medium">
                        {t.debit > 0 ? t.debit.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-right font-medium">
                        {t.credit > 0 ? t.credit.toLocaleString() : '-'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-bold ${
                        t.balance > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {t.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={5} className="px-4 py-4 text-sm font-bold text-slate-700 text-right">
                      Final Balance:
                    </td>
                    <td className={`px-4 py-4 text-sm text-right font-black ${
                      statement[statement.length - 1].balance > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {statement[statement.length - 1].balance.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No transactions found for this student.</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
