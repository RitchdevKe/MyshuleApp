"use client";
import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Calendar, BarChart, Loader2, Users, AlertTriangle } from "lucide-react";
import { generateAttendanceReport } from "./actions";

export default function AttendanceReportsTab() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("Detailed Attendance Log");
  const [cohort, setCohort] = useState("Whole School");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateAttendanceReport({ type: reportType, cohort, startDate, endDate });
      if (res.success) {
        setReportData(res);
      } else {
        alert("Failed to generate report.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6">
      
      {/* Report Configuration Sidebar */}
      <div className="w-full md:w-1/3 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart className="w-6 h-6 text-indigo-500" /> Generate Report
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Select parameters to generate an attendance export.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500"
            >
              <option>Detailed Attendance Log</option>
              <option>Chronic Absenteeism Summary</option>
              <option>Leave Request History</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">Cohort</label>
            <select 
              value={cohort} 
              onChange={(e) => setCohort(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500"
            >
              <option>Whole School</option>
              <option>Primary</option>
              <option>Secondary</option>
              <option>Grade 8</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">Date Range</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="flex items-center text-slate-400">-</div>
              <div className="relative flex-1">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm focus:outline-none focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 
            {loading ? "Generating..." : "Generate Report"}
          </button>
          
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50" disabled={!reportData}>
              <FileText className="w-4 h-4 text-rose-500" /> PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50" disabled={!reportData}>
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 bg-white/60 backdrop-blur-md rounded-3xl border border-white p-6 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {!reportData && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 text-slate-300">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Preview Data</h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mt-2">
              Configure the report parameters on the left and click "Generate Report" to preview the data here before exporting.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
             <h3 className="text-xl font-black text-slate-800">Compiling Data...</h3>
          </div>
        )}

        {reportData && !loading && (
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <BarChart className="w-6 h-6 text-indigo-500" /> {reportType} Preview
            </h3>
            
            {/* Top Summary Card showing calculated data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-slate-500 mb-1">
                   <Users className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">Students</span>
                 </div>
                 <div className="text-2xl font-black text-slate-800">{reportData.summary.totalStudents}</div>
               </div>
               <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-emerald-500 mb-1">
                   <BarChart className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">Avg Att.</span>
                 </div>
                 <div className="text-2xl font-black text-slate-800">{reportData.summary.averageAttendance}</div>
               </div>
               <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-rose-500 mb-1">
                   <AlertTriangle className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">Absences</span>
                 </div>
                 <div className="text-2xl font-black text-slate-800">{reportData.summary.totalAbsences}</div>
               </div>
               <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 text-amber-500 mb-1">
                   <AlertTriangle className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">Chronic</span>
                 </div>
                 <div className="text-2xl font-black text-slate-800">{reportData.summary.chronicAbsentees}</div>
               </div>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-2xl border border-slate-100 shadow-sm hide-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Date</th>
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Student Name</th>
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.data.map((row: any) => (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-600">{row.date}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800">{row.studentName}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          row.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                          row.status === 'ABSENT' ? 'bg-rose-100 text-rose-700' :
                          row.status === 'LATE' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-[150px]">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                  {reportData.data.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm font-medium">No records found for the selected parameters.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
