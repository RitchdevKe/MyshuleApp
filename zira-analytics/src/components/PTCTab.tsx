import React, { useState } from 'react';
import { Plus, X, Search, CalendarDays, Clock, CheckCircle2, User, UserPlus, Filter, CalendarCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function PTCTab() {
  const [ptcBookings, setPtcBookings] = useState([
    { id: '1', parentName: 'Mr. Bernard Kiprop', studentName: 'Kevin Kiprop', teacherName: 'Mr. Daniel Gitumu', date: '2026-06-05', time: '10:00 AM - 10:30 AM', status: 'Approved' },
    { id: '2', parentName: 'Mrs. Janet Omari', studentName: 'Douglas Omari', teacherName: 'Mrs. Mercy Chepkoech', date: '2026-06-05', time: '11:00 AM - 11:30 AM', status: 'Pending' },
    { id: '3', parentName: 'Mr. Julius Wanjala', studentName: 'Emily Wanjala', teacherName: 'Mr. Shadrack Kiprop', date: '2026-06-06', time: '02:00 PM - 02:30 PM', status: 'Approved' },
    { id: '4', parentName: 'Mrs. Sophy Ndanu', studentName: 'Adrian Kipirono', teacherName: 'Mr. Dennis Omwamba', date: '2026-06-06', time: '04:00 PM - 04:30 PM', status: 'Rejected' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = ptcBookings.filter(b => {
    const matchesSearch = b.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700';
      case 'Pending': return 'bg-amber-50 text-amber-700';
      case 'Rejected': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Total Scheduled</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums block mt-1">{ptcBookings.length}</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Approved</span>
            <span className="text-2xl font-bold text-emerald-600 tabular-nums block mt-1">
              {ptcBookings.filter(b => b.status === 'Approved').length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm flex items-center justify-between">
          <div>
             <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Pending</span>
            <span className="text-2xl font-bold text-amber-600 tabular-nums block mt-1">
              {ptcBookings.filter(b => b.status === 'Pending').length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
           <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
             <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" /> Parent-Teacher Consultations
           </h3>
           <p className="text-xs text-slate-400 mt-0.5">Book and manage appointment slots with guardians.</p>
        </div>

        {/* Quick booking section */}
        <div className="p-4 flex flex-col md:flex-row gap-2.5 items-end border-b border-slate-100">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Teacher</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="ptc-teacher" className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium transition placeholder:text-slate-400" placeholder="e.g. Mr. Daniel Gitumu" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
            <div className="relative">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="date" id="ptc-date" className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-700 cursor-pointer tabular-nums transition" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Time</label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="ptc-time" className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium transition placeholder:text-slate-400 tabular-nums" placeholder="10:00 AM - 10:30 AM" />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button 
              onClick={() => {
                const teacher = document.getElementById('ptc-teacher') as HTMLInputElement;
                const date = document.getElementById('ptc-date') as HTMLInputElement;
                const time = document.getElementById('ptc-time') as HTMLInputElement;
                if (teacher?.value && date?.value && time?.value) {
                  setPtcBookings([{
                    id: String(Date.now()),
                    parentName: 'Walk-in Parent',
                    studentName: 'General Inquiry',
                    teacherName: teacher.value,
                    date: date.value,
                    time: time.value,
                    status: 'Pending'
                  }, ...ptcBookings]);
                  teacher.value = '';
                  date.value = '';
                  time.value = '';
                  toast.success('PTC slot booked.');
                } else {
                  toast.error('Please fill in all fields.');
                }
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-sm font-medium rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 border-none shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Book Session
            </button>
          </div>
        </div>

        {/* Filtering Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by pupil, teacher, or parent..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-xs font-normal text-slate-700 transition placeholder:text-slate-400"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Guardian</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Student</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Teacher</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Slot</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                       <CalendarCheck className="w-7 h-7 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm">No bookings match these filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(b => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={b.id} 
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        {b.parentName}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-sm">{b.studentName}</td>
                      <td className="px-4 py-2.5 font-medium text-indigo-600 text-sm">{b.teacherName}</td>
                      <td className="px-4 py-2.5 tabular-nums">
                        <span className="block text-slate-700 font-medium text-sm">{b.time}</span>
                        <span className="block text-slate-400 text-[11px] mt-0.5">{b.date}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg font-medium text-[11px] ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
