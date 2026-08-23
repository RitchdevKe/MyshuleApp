import React, { useState } from 'react';
import { Plus, X, Search, CalendarDays, CalendarClock, Ban, MapPin, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function LeaveManagementTab() {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: '1', name: 'Mr. Julius Karega', type: 'Sick Leave', start: '2026-05-28', end: '2026-05-30', days: 2, status: 'Approved' },
    { id: '2', name: 'Mr. Dennis Omwamba', type: 'Personal Leave', start: '2026-06-02', end: '2026-06-04', days: 3, status: 'Pending' },
    { id: '3', name: 'Mrs. Winnie Tabitha', type: 'Maternity Leave', start: '2026-07-01', end: '2026-09-30', days: 90, status: 'Approved' }
  ]);

  const [leaveSearchQuery, setLeaveSearchQuery] = useState('');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('All');
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [newLeaveStaff, setNewLeaveStaff] = useState('');
  const [newLeaveType, setNewLeaveType] = useState('Sick Leave');
  const [newLeaveStart, setNewLeaveStart] = useState('');
  const [newLeaveEnd, setNewLeaveEnd] = useState('');
  const [newLeaveDays, setNewLeaveDays] = useState(3);

  const totalLeavesCount = leaveRequests.length;
  const approvedLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'Pending').length;
  const totalDaysAway = leaveRequests.reduce((acc, l) => acc + (l.status === 'Approved' ? l.days : 0), 0);

  const filteredLeaves = leaveRequests.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(leaveSearchQuery.toLowerCase());
    const matchesStatus = leaveStatusFilter === 'All' || l.status === leaveStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Filed Leaves</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">{totalLeavesCount}</span>
            <span className="text-[16px] font-bold block mt-1.5 bg-slate-100 text-slate-600 w-fit px-2 py-0.5 rounded-md">
              Cumulative records
            </span>
          </div>
          <CalendarDays className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Currently Approved</span>
            <span className="text-4xl font-bold text-emerald-600 tabular-nums block mt-1">{approvedLeavesCount}</span>
            <span className="text-[16px] text-emerald-700 font-bold block mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
              Active personnel away
            </span>
          </div>
          <MapPin className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[var(--color-secondary)] p-5 md:p-6 rounded-2xl shadow-md text-white relative overflow-hidden group border border-[var(--color-secondary)]">
          <div className="relative z-10">
            <span className="text-[16px] text-white/70 font-bold uppercase tracking-wider block">Pending Resolution</span>
            <span className="text-4xl font-bold tabular-nums block mt-1">{pendingLeavesCount}</span>
            <span className="text-[15px] font-bold block mt-1.5 bg-black/20 w-fit px-2 py-0.5 rounded-md border border-white/10 text-white uppercase tracking-wider">
              Awaiting confirmation
            </span>
          </div>
          <CalendarClock className="w-20 h-20 text-white opacity-10 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Absence Volume</span>
            <span className="text-4xl font-bold text-rose-500 tabular-nums block mt-1">{totalDaysAway}</span>
            <span className="text-[16px] text-rose-700 font-bold block mt-1.5 bg-rose-50 w-fit px-2 py-0.5 rounded-md">
              Total productive days nullified
            </span>
          </div>
          <Ban className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2 tabular-nums">
              <CalendarDays className="w-5 h-5 text-[var(--color-secondary)]" /> Staff Administrative Leave Policy
            </h3>
            <p className="text-[17px] text-slate-500 mt-1 font-medium max-w-2xl">Manage formal time-off applications, determine compensatory absences, and ensure operational resilience.</p>
          </div>
          <button 
            onClick={() => setShowAddLeaveModal(true)}
            className="px-5 py-2.5 bg-[var(--color-secondary)] text-white text-[17px] font-bold rounded-xl hover:bg-[var(--color-primary)] transition cursor-pointer flex items-center gap-2 shadow-md shadow-[var(--color-secondary)]/20 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Lodge Leave Form
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -mt-2" />
            <input 
              type="text" 
              placeholder="Search personnel directory..." 
              value={leaveSearchQuery}
              onChange={e => setLeaveSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] text-lg font-bold text-slate-800 transition-all tabular-nums placeholder:text-slate-400 placeholder:font-sans"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 px-1.5 py-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
            <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wide whitespace-nowrap hidden sm:inline-block">Approval Ledger</span>
            <select 
              value={leaveStatusFilter}
              onChange={e => setLeaveStatusFilter(e.target.value)}
              className="bg-transparent text-[17px] font-bold focus:outline-none text-slate-700 cursor-pointer appearance-none pl-1 pr-4 uppercase tracking-wide tabular-nums"
            >
              <option value="All">All Filter Tiers</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Permitted Leaves</option>
              <option value="Declined">Nullified Leaves</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Billed Applicant Surname</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Permit Typology</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Time Duration Phase</th>
                <th className="px-6 py-4 font-bold text-center uppercase tracking-wider text-[15px] tabular-nums">Decision Verdict</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[15px] tabular-nums">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 bg-white">
              <AnimatePresence>
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
                       <SearchX className="w-10 h-10 text-slate-200 mx-auto mb-3 stroke-[1.5]" />
                      No formalized structural leaves captured.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map(l => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={l.id} 
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-[18px] text-slate-900 bg-white">
                        <span className="block">{l.name}</span>
                        <span className="text-[14px] text-slate-400 uppercase tracking-wide tabular-nums mt-1 block">Staff Record Active</span>
                      </td>
                      <td className="px-6 py-4 text-indigo-700 font-bold text-[17px] bg-slate-50/30">{l.type}</td>
                      <td className="px-6 py-4 bg-white">
                        <div className="tabular-nums text-slate-700 font-bold text-[16px] bg-slate-100 w-fit px-2 py-1 rounded inline-block border border-slate-200">{l.start} to {l.end}</div>
                        <div className="text-[14px] uppercase font-bold text-slate-400 mt-1.5 tracking-widest">{l.days} days net duration</div>
                      </td>
                      <td className="px-6 py-4 text-center bg-slate-50/30">
                        <span className={`px-2.5 py-1 rounded-md font-bold text-[14px] uppercase tracking-wide border inline-block ${
                          l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' :
                          l.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' :
                          'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right bg-white">
                        {l.status === 'Pending' && (
                          <div className="space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(leave => leave.id === l.id ? { ...leave, status: 'Approved' } : leave));
                                toast.success(`Leave request for ${l.name} approved.`);
                              }}
                              className="px-3 py-1.5 text-[15px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-lg transition-colors cursor-pointer inline-block uppercase tracking-wide tabular-nums shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(leave => leave.id === l.id ? { ...leave, status: 'Declined' } : leave));
                                toast.error(`Leave request for ${l.name} declined.`);
                              }}
                              className="px-3 py-1.5 text-[15px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-lg transition-colors cursor-pointer inline-block uppercase tracking-wide tabular-nums shadow-sm"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                        {l.status !== 'Pending' && (
                          <span className="text-slate-300 text-[15px] tabular-nums tracking-widest uppercase italic font-bold">Processed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LEAVE MODAL */}
      <AnimatePresence>
        {showAddLeaveModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2 tracking-tight uppercase tabular-nums">
                  <CalendarDays className="w-5 h-5 text-[var(--color-secondary)]" /> Initiate Leave Query
                </h3>
                <button onClick={() => setShowAddLeaveModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 font-sans">
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Applicant Surname Registry</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mrs. Sarah Tanui"
                    value={newLeaveStaff}
                    onChange={e => setNewLeaveStaff(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] text-lg font-bold text-slate-800 transition-shadow shadow-inner"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Leave Category</label>
                    <select 
                      value={newLeaveType}
                      onChange={e => setNewLeaveType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[17px] font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] appearance-none transition-shadow text-center"
                    >
                      <option value="Sick Leave">Sick Outlay</option>
                      <option value="Personal Leave">Personal Void</option>
                      <option value="Maternity Leave">Maternity Relief</option>
                      <option value="Annual Leave">Annual Subsidy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Calculated Net Days</label>
                    <input 
                      type="number"
                      value={newLeaveDays}
                      onChange={e => setNewLeaveDays(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] text-lg font-bold text-slate-900 tabular-nums transition-shadow shadow-inner text-center"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-xl space-y-2">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Commencement Point</label>
                    <input 
                      type="date" 
                      value={newLeaveStart}
                      onChange={e => setNewLeaveStart(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] text-lg font-bold text-slate-700 transition-shadow tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Return Termination Phase</label>
                    <input 
                      type="date" 
                      value={newLeaveEnd}
                      onChange={e => setNewLeaveEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] text-lg font-bold text-slate-700 transition-shadow tabular-nums"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (!newLeaveStaff.trim() || !newLeaveStart || !newLeaveEnd || newLeaveDays <= 0) {
                        toast.error('Supply standard inputs to finalize leave entry.');
                        return;
                      }

                      setLeaveRequests([
                        {
                          id: String(Date.now()),
                          name: newLeaveStaff,
                          type: newLeaveType,
                          start: newLeaveStart,
                          end: newLeaveEnd,
                          days: newLeaveDays,
                          status: 'Pending'
                        },
                        ...leaveRequests
                      ]);
                      
                      toast.success(`Leave entry processed correctly. Marked for pending authorization.`);
                      setShowAddLeaveModal(false);
                    }}
                    className="w-full py-3 bg-[var(--color-secondary)] text-white font-bold rounded-xl shadow-md shadow-[var(--color-secondary)]/20 text-[13.5px] hover:bg-[var(--color-primary)] transition-colors"
                  >
                    Commit Formal Ledger Query
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
