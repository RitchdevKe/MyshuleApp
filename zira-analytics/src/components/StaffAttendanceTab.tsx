import React, { useState } from 'react';
import { Plus, X, Search, Clock, Users, UserCheck, AlertTriangle, UserX, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function StaffAttendanceTab() {
  const [staffAttendance, setStaffAttendance] = useState([
    { id: '1', name: 'Mr. Daniel Gitumu', roll: 'Teacher', date: '2026-05-27', clockedIn: '07:15 AM', status: 'On-Time' },
    { id: '2', name: 'Mrs. Mercy Chepkoech', roll: 'Deputy Principal', date: '2026-05-27', clockedIn: '07:28 AM', status: 'On-Time' },
    { id: '3', name: 'Mr. Shadrack Kiprop', roll: 'Accountant', date: '2026-05-27', clockedIn: '08:02 AM', status: 'Late' },
    { id: '4', name: 'Mrs. Angela Ndwiga', roll: 'Librarian', date: '2026-05-27', clockedIn: '07:40 AM', status: 'On-Time' }
  ]);

  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All');
  const [showAddAttendanceModal, setShowAddAttendanceModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Teacher');
  const [newStaffClocked, setNewStaffClocked] = useState('07:30 AM');
  const [newStaffStatus, setNewStaffStatus] = useState('On-Time');

  const totalStaffCount = staffAttendance.length;
  const onTimeCount = staffAttendance.filter(s => s.status === 'On-Time').length;
  const lateCount = staffAttendance.filter(s => s.status === 'Late').length;
  const absentCount = staffAttendance.filter(s => s.status === 'Absent').length;

  const filteredStaff = staffAttendance.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) || 
                          s.roll.toLowerCase().includes(staffSearchQuery.toLowerCase());
    const matchesStatus = staffStatusFilter === 'All' || s.status === staffStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Total Staff</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{totalStaffCount}</p>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">On-Time</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{onTimeCount}</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(onTimeCount / totalStaffCount) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Late</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{lateCount}</p>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(lateCount / totalStaffCount) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Absent</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <UserX className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{absentCount}</p>
        </div>
      </div>

      {/* Main register */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">

        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C20F47]" /> Staff Attendance Register
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Daily check-ins and punctuality log</p>
          </div>
          <button
            onClick={() => setShowAddAttendanceModal(true)}
            className="px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm border-none shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Log Entry
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff..."
              value={staffSearchQuery}
              onChange={e => setStaffSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-xs font-normal text-slate-700 transition shadow-sm"
            />
          </div>
          <select
            value={staffStatusFilter}
            onChange={e => setStaffStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="On-Time">On-Time</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Name</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Role</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Date</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Clock In</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <UserMinus className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm">No staff attendance records found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map(s => (
                    <motion.tr
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={s.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{s.name}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-sm">{s.roll}</td>
                      <td className="px-4 py-2.5 text-slate-400 tabular-nums text-xs">{s.date}</td>
                      <td className="px-4 py-2.5 tabular-nums text-slate-600 text-sm">{s.clockedIn}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                          s.status === 'On-Time' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          s.status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {s.status}
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

      {/* Add Staff Attendance Modal */}
      <AnimatePresence>
        {showAddAttendanceModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl p-5 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C20F47]" /> Log Attendance
                </h3>
                <button onClick={() => setShowAddAttendanceModal(false)} className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors cursor-pointer border-none">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Staff Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. John Doe"
                    value={newStaffName}
                    onChange={e => setNewStaffName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-normal text-slate-800 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                  >
                    <option value="Teacher">Subject Teacher</option>
                    <option value="Deputy Principal">Deputy Principal</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Time In</label>
                    <input
                      type="text"
                      placeholder="07:30 AM"
                      value={newStaffClocked}
                      onChange={e => setNewStaffClocked(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-900 tabular-nums text-center transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                    <select
                      value={newStaffStatus}
                      onChange={e => setNewStaffStatus(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm text-slate-700 text-center transition"
                    >
                      <option value="On-Time">On-Time</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      if (!newStaffName.trim() || !newStaffClocked.trim()) {
                        toast.error('All fields are required to mark attendance.');
                        return;
                      }
                      setStaffAttendance([{
                        id: String(Date.now()),
                        name: newStaffName,
                        roll: newStaffRole,
                        date: new Date().toISOString().split('T')[0],
                        clockedIn: newStaffClocked,
                        status: newStaffStatus
                      }, ...staffAttendance]);

                      setNewStaffName('');
                      toast.success(`Entry logged for ${newStaffName}!`);
                      setShowAddAttendanceModal(false);
                    }}
                    className="w-full py-2.5 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium rounded-lg shadow-sm text-sm transition cursor-pointer border-none"
                  >
                    Save Entry
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
