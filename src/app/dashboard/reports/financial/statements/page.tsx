"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, Filter, ChevronRight, FileSpreadsheet } from "lucide-react";

export default function StatementsPage() {
  const [statementType, setStatementType] = useState("income");

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Financial Statements</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Generate official P&L, Balance Sheets, and Trial Balances.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Parameters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex-none">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-2">
            <button 
               onClick={() => setStatementType('income')}
               className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  statementType === 'income' 
                  ? 'bg-white border-primary-300 shadow-sm' 
                  : 'bg-slate-50/50 border-transparent hover:bg-slate-100'
               }`}
            >
               <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${statementType === 'income' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm ${statementType === 'income' ? 'text-primary-900' : 'text-slate-600'}`}>Income Statement</span>
               </div>
               {statementType === 'income' && <ChevronRight className="w-4 h-4 text-primary-400" />}
            </button>
            <button 
               onClick={() => setStatementType('balance')}
               className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  statementType === 'balance' 
                  ? 'bg-white border-primary-300 shadow-sm' 
                  : 'bg-slate-50/50 border-transparent hover:bg-slate-100'
               }`}
            >
               <div className="flex items-center gap-3">
                  <FileSpreadsheet className={`w-5 h-5 ${statementType === 'balance' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm ${statementType === 'balance' ? 'text-primary-900' : 'text-slate-600'}`}>Balance Sheet</span>
               </div>
               {statementType === 'balance' && <ChevronRight className="w-4 h-4 text-primary-400" />}
            </button>
            <button 
               onClick={() => setStatementType('trial')}
               className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  statementType === 'trial' 
                  ? 'bg-white border-primary-300 shadow-sm' 
                  : 'bg-slate-50/50 border-transparent hover:bg-slate-100'
               }`}
            >
               <div className="flex items-center gap-3">
                  <FileSpreadsheet className={`w-5 h-5 ${statementType === 'trial' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm ${statementType === 'trial' ? 'text-primary-900' : 'text-slate-600'}`}>Trial Balance</span>
               </div>
               {statementType === 'trial' && <ChevronRight className="w-4 h-4 text-primary-400" />}
            </button>
         </div>

         {/* Document Preview Area */}
         <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            {/* Document Header */}
            <div className="p-8 border-b border-slate-200 text-center bg-slate-50/30">
               <h1 className="text-2xl font-black text-slate-800">GREEN VALLEY ACADEMY</h1>
               <h2 className="text-lg font-bold text-slate-600 mt-2 uppercase tracking-widest">
                  {statementType === 'income' ? 'Income Statement' : statementType === 'balance' ? 'Balance Sheet' : 'Trial Balance'}
               </h2>
               <p className="text-sm font-medium text-slate-500 mt-1">For the Period Ended: Oct 31, 2026</p>
               <p className="text-xs font-medium text-slate-400">Currency: KES (KSh)</p>
            </div>

            {/* Document Body (Simulated Income Statement) */}
            {statementType === 'income' && (
               <div className="p-8 flex-1 overflow-y-auto">
                  
                  {/* Revenue */}
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Revenue</h3>
                  <div className="space-y-3 mb-8">
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Tuition Fees</span>
                        <span className="text-sm font-bold text-slate-800">65,400,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Transport Fees</span>
                        <span className="text-sm font-bold text-slate-800">12,200,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Meals/Catering</span>
                        <span className="text-sm font-bold text-slate-800">7,000,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4 pt-3 border-t border-slate-100 font-black">
                        <span className="text-sm text-slate-800">Total Revenue</span>
                        <span className="text-sm text-emerald-700">84,600,000</span>
                     </div>
                  </div>

                  {/* Expenses */}
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Expenses</h3>
                  <div className="space-y-3 mb-8">
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Staff Salaries & Benefits</span>
                        <span className="text-sm font-bold text-slate-800">35,500,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Academic Supplies</span>
                        <span className="text-sm font-bold text-slate-800">4,200,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Facility Maintenance</span>
                        <span className="text-sm font-bold text-slate-800">5,800,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Administrative Costs</span>
                        <span className="text-sm font-bold text-slate-800">3,100,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <span className="text-sm text-slate-700">Marketing & Events</span>
                        <span className="text-sm font-bold text-slate-800">2,600,000</span>
                     </div>
                     <div className="flex justify-between items-center px-4 pt-3 border-t border-slate-100 font-black">
                        <span className="text-sm text-slate-800">Total Expenses</span>
                        <span className="text-sm text-rose-700">51,200,000</span>
                     </div>
                  </div>

                  {/* Net Income */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center font-black">
                     <span className="text-base text-slate-800">Net Income</span>
                     <span className="text-xl text-indigo-700 underline decoration-double underline-offset-4">33,400,000</span>
                  </div>

               </div>
            )}

            {/* Other Document Stubs */}
            {statementType !== 'income' && (
               <div className="p-8 flex-1 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                     <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                     <p className="font-bold">Select parameters to generate {statementType === 'balance' ? 'Balance Sheet' : 'Trial Balance'}.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
