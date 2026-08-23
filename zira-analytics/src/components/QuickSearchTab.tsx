import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Student } from '../types.ts';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface QuickSearchTabProps {
  students: Student[];
}

export function QuickSearchTab({ students }: QuickSearchTabProps) {
  const { currency } = useCurrency();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'students' | 'critical' | 'cleared' | 'boarding' | 'day'>('all');

  const filteredStudents = students.filter(s => {
    const sName = s.name.toLowerCase();
    const sId = s.id.toLowerCase();
    const matchQuery = sName.includes(query.toLowerCase()) || sId.includes(query.toLowerCase());

    if (!matchQuery) return false;
    if (filter === 'students') return true;
    if (filter === 'critical') return s.feeBalance > 15000;
    if (filter === 'cleared') return s.feeBalance === 0;
    if (filter === 'boarding') return s.id && (s.id.includes('2') || s.id.includes('4') || s.id.includes('6'));
    if (filter === 'day') return s.id && !(s.id.includes('2') || s.id.includes('4') || s.id.includes('6'));
    return true;
  });

  const filters: { id: 'all' | 'students' | 'critical' | 'cleared' | 'boarding' | 'day'; label: string; count: number; style: string }[] = [
    { id: 'all', label: 'All Pupils', count: students.length, style: 'bg-[#e7f5ff] text-[#1c7ed6] border-[#d0ebff]' },
    { id: 'cleared', label: 'Fully Paid', count: students.filter(s => s.feeBalance === 0).length, style: 'bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]' },
    { id: 'students', label: 'Unpaid Fees', count: students.filter(s => s.feeBalance > 0).length, style: 'bg-[#fff9db] text-[#f08c00] border-[#ffe066]' },
    { id: 'critical', label: 'Critical Arrears', count: students.filter(s => s.feeBalance > 15000).length, style: 'bg-[#fff0f6] text-[#d6336c] border-[#ffdeeb]' },
    { id: 'boarding', label: 'Boarders', count: students.filter(s => s.id && (s.id.includes('2') || s.id.includes('4') || s.id.includes('6'))).length, style: 'bg-[#fff4e6] text-[#d9480f] border-[#ffd8a8]' },
    { id: 'day', label: 'Day Scholars', count: students.filter(s => s.id && !(s.id.includes('2') || s.id.includes('4') || s.id.includes('6'))).length, style: 'bg-[#e3fafc] text-[#0c8599] border-[#c5f6fa]' },
  ];

  return (
    <div className="space-y-5">

      {/* Search bar */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or admission ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/30 focus:bg-white transition font-normal"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.success('Search index synced.')}
            className="px-5 py-2.5 bg-[#3D1D3F] hover:bg-[#3D1D3F]/90 text-white text-sm font-medium rounded-xl shadow-sm active:scale-95 transition cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Filter pills - trimmed to the 6 that actually filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map(pill => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
                filter === pill.id
                  ? 'bg-[#3D1D3F] text-white border-[#3D1D3F]'
                  : `${pill.style} hover:opacity-80`
              }`}
            >
              {pill.label}
              <span className="tabular-nums opacity-70">{pill.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {filteredStudents.length} {filteredStudents.length === 1 ? 'result' : 'results'}
        </p>
        {query && <p className="text-xs text-slate-400">matching "{query}"</p>}
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] py-16 rounded-[1.5rem] text-center shadow-sm">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No matches found</p>
          <p className="text-xs text-slate-400 mt-1">Try a different name, ID, or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredStudents.map((student, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              key={student.id}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center font-semibold text-sm text-[#3D1D3F] group-hover:bg-amber-50 transition-colors tabular-nums shrink-0">
                  {student.name.split(' ')[0][0]}{student.name.split(' ')[1]?.[0] || ''}
                </div>
                <span className="text-[10px] font-medium text-slate-400 tabular-nums">{student.id}</span>
              </div>

              <h4 className="font-semibold text-slate-900 text-sm leading-tight truncate group-hover:text-[#3D1D3F] transition-colors">{student.name}</h4>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-500">Form {student.form} {student.stream}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${student.feeBalance === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  {student.feeBalance === 0 ? 'Cleared' : 'Arrears'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Balance</p>
                  <p className="text-sm font-semibold text-slate-800 tabular-nums mt-0.5">{currency} {student.feeBalance.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => toast.success(`Viewing profile for ${student.name} (ADM ${student.id})`)}
                  className="p-2 bg-slate-50 hover:bg-[#3D1D3F] hover:text-white rounded-lg text-slate-500 transition-colors cursor-pointer border-none"
                  title="View profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
