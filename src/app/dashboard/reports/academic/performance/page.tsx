"use client";
import React, { useEffect, useState } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus, Download, Filter, Target, X, Check } from "lucide-react";
import { getPerformanceData, getFilterOptions } from "./actions";

type PerformanceData = Awaited<ReturnType<typeof getPerformanceData>>;
type FilterOptions = Awaited<ReturnType<typeof getFilterOptions>>;

export default function AcademicPerformanceTab() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [termId, setTermId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [res, opts] = await Promise.all([
           getPerformanceData(),
           getFilterOptions()
        ]);
        setData(res);
        setFilterOptions(opts);
      } catch (err) {
        console.error("Failed to load performance data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
       const res = await getPerformanceData({ termId: termId || undefined, classId: classId || undefined });
       setData(res);
       setShowFilters(false);
    } catch (err) {
       console.error("Failed to apply filters", err);
    } finally {
       setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setTermId("");
    setClassId("");
    setLoading(true);
    try {
       const res = await getPerformanceData({});
       setData(res);
       setShowFilters(false);
    } catch (err) {
       console.error("Failed to clear filters", err);
    } finally {
       setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !data) {
    return <div className="p-6 text-center text-slate-500">Loading performance data...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-slate-500">No data available.</div>;
  }

  const { subjects, topClass, needsInterventionClass } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center print:hidden">
         <div>
            <h2 className="text-lg font-black text-slate-800">Performance Analytics</h2>
            <p className="text-sm text-slate-500">Detailed breakdown of academic performance across subjects and classes.</p>
         </div>
         <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export PDF
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Subject Performance */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-800">Subject Performance</h3>
               <button onClick={() => setShowFilters(!showFilters)} className={`text-xs font-bold flex items-center gap-1 transition-colors ${showFilters ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>
                  <Filter className="w-3 h-3" /> Filters
               </button>
            </div>
            
            {showFilters && (
               <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 items-end print:hidden">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Term</label>
                     <select 
                        value={termId} 
                        onChange={(e) => setTermId(e.target.value)}
                        className="block w-48 rounded-lg border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                     >
                        <option value="">All Terms</option>
                        {filterOptions?.terms.map(t => (
                           <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500">Class</label>
                     <select 
                        value={classId} 
                        onChange={(e) => setClassId(e.target.value)}
                        className="block w-48 rounded-lg border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                     >
                        <option value="">All Classes</option>
                        {filterOptions?.classes.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handleApplyFilters} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Apply
                     </button>
                     <button onClick={handleClearFilters} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 flex items-center gap-1">
                        <X className="w-4 h-4" /> Clear
                     </button>
                  </div>
               </div>
            )}

            <div className={`p-5 space-y-6 ${loading ? 'opacity-50' : ''}`}>
               {subjects.length === 0 ? (
                 <div className="text-center text-slate-500 text-sm py-8">No performance data found for the selected filters.</div>
               ) : (
                 subjects.map((subject, index) => (
                    <div key={index}>
                       <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-slate-800 text-sm">{subject.name}</div>
                          <div className="flex items-center gap-4">
                             <div className="text-sm font-black text-slate-700">{subject.avg}%</div>
                             <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider w-16 justify-end ${
                                subject.status === 'improving' ? 'text-emerald-600' : 
                                subject.status === 'declining' ? 'text-rose-600' : 'text-slate-500'
                             }`}>
                                {subject.trend > 0 ? '+' : ''}{subject.trend}% 
                                {subject.status === 'improving' && <TrendingUp className="w-3 h-3" />}
                                {subject.status === 'declining' && <TrendingDown className="w-3 h-3" />}
                                {subject.status === 'steady' && <Minus className="w-3 h-3" />}
                             </div>
                          </div>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                             className={`h-2 rounded-full ${
                                subject.avg >= 80 ? 'bg-emerald-500' : 
                                subject.avg >= 65 ? 'bg-indigo-500' : 
                                subject.avg >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                             }`} 
                             style={{ width: `${subject.avg}%` }}
                          ></div>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Matrix */}
         <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
               <Target className="w-24 h-24 text-emerald-100 absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 transition-transform" />
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-2">Top Performing Class</h3>
                  {topClass ? (
                    <>
                      <div className="text-3xl font-black text-emerald-800 mb-1">{topClass.name}</div>
                      <div className="text-sm font-bold text-emerald-700">Average: {topClass.avg}%</div>
                      <div className="mt-4 pt-4 border-t border-emerald-200/50">
                         <div className="text-xs text-emerald-700 font-medium">Strongest in: {topClass.bestSubject.name} ({topClass.bestSubject.avg}%)</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-emerald-700">No data</div>
                  )}
               </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
               <TrendingDown className="w-24 h-24 text-rose-100 absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 transition-transform" />
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-rose-600 mb-2">Needs Intervention</h3>
                  {needsInterventionClass ? (
                    <>
                      <div className="text-3xl font-black text-rose-800 mb-1">{needsInterventionClass.name}</div>
                      <div className="text-sm font-bold text-rose-700">Average: {needsInterventionClass.avg}%</div>
                      <div className="mt-4 pt-4 border-t border-rose-200/50">
                         <div className="text-xs text-rose-700 font-medium">Weakest in: {needsInterventionClass.worstSubject.name} ({needsInterventionClass.worstSubject.avg}%)</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-rose-700">No data</div>
                  )}
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
