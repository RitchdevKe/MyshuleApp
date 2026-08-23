import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Users, 
  Search,
  BookOpen,
  Trophy,
  Briefcase,
  XCircle,
  ChevronRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DiaryEntry {
  id: string;
  type: 'class' | 'co-curricular' | 'admin' | 'other';
  title: string;
  startTime: string;
  endTime: string;
  details?: string;
  status: 'pending' | 'completed' | 'skipped';
  addedBy: 'self' | 'admin';
}

interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  avatarColor: string;
  entries: DiaryEntry[];
}

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-purple-500'
];

export function WorkDiariesTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy Data
  const [staffData, setStaffData] = useState<StaffMember[]>([
    {
      id: '1', name: 'Mr. Kiprop', department: 'Mathematics', role: 'Senior Teacher', avatarColor: COLORS[0],
      entries: [
        { id: '101', type: 'class', title: 'Form 4 Math (Calculus)', startTime: '08:00', endTime: '09:20', status: 'completed', addedBy: 'self', details: 'Covering integration basics.' },
        { id: '102', type: 'admin', title: 'Department Meeting', startTime: '10:00', endTime: '11:00', status: 'completed', addedBy: 'admin', details: 'Review mock exams.' },
        { id: '103', type: 'class', title: 'Form 2 Math', startTime: '11:30', endTime: '12:50', status: 'pending', addedBy: 'self' },
        { id: '104', type: 'co-curricular', title: 'Chess Club Patron', startTime: '16:00', endTime: '17:30', status: 'pending', addedBy: 'admin' },
      ]
    },
    {
      id: '2', name: 'Mrs. Mutua', department: 'Languages', role: 'HOD English', avatarColor: COLORS[4],
      entries: [
        { id: '201', type: 'class', title: 'Form 3 English', startTime: '08:00', endTime: '09:20', status: 'completed', addedBy: 'self' },
        { id: '202', type: 'other', title: 'Remedial Reading', startTime: '14:00', endTime: '15:00', status: 'pending', addedBy: 'self', details: 'Special attention to 3 struggling students.' }
      ]
    },
    { id: '3', name: 'Coach Omondi', department: 'Sports', role: 'Games Master', avatarColor: COLORS[3], entries: [] }
  ]);

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffData[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    type: 'class', status: 'pending', addedBy: 'admin', startTime: '08:00', endTime: '09:00'
  });

  const selectedStaff = staffData.find(s => s.id === selectedStaffId);

  const filteredStaff = staffData.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'class': return { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200', text: 'text-blue-700', icon: BookOpen };
      case 'co-curricular': return { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', icon: Trophy };
      case 'admin': return { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', icon: Briefcase };
      default: return { bg: 'bg-slate-50 hover:bg-slate-100', border: 'border-slate-200', text: 'text-slate-700', icon: LayoutGrid };
    }
  };

  const toggleStatus = (entryId: string, currentStatus: string) => {
    if (!selectedStaff) return;
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    setStaffData(staffData.map(staff => {
      if (staff.id === selectedStaff.id) {
        return {
          ...staff,
          entries: staff.entries.map(e => e.id === entryId ? { ...e, status: newStatus as any } : e)
        };
      }
      return staff;
    }));
    
    if (newStatus === 'completed') toast.success('Task marked as completed.');
  };

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.startTime || !newEntry.endTime) {
      toast.error('Please fill required fields');
      return;
    }

    const entry: DiaryEntry = {
      ...(newEntry as DiaryEntry),
      id: Math.random().toString(36).substring(2,9)
    };

    setStaffData(staffData.map(staff => {
      if (staff.id === selectedStaff?.id) {
        return { ...staff, entries: [...staff.entries, entry].sort((a,b) => a.startTime.localeCompare(b.startTime)) };
      }
      return staff;
    }));

    setNewEntry({ type: 'class', status: 'pending', addedBy: 'admin', startTime: '08:00', endTime: '09:00' });
    setShowAddModal(false);
    toast.success('Diary log added to schedule.');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

  const completedCount = selectedStaff?.entries.filter(e => e.status === 'completed').length || 0;
  const totalCount = selectedStaff?.entries.length || 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 items-start">

      {/* Staff Directory */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col lg:max-h-[640px]">
        <div className="p-3.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users className="w-3.5 h-3.5 text-[#C20F47]" />
            <h2 className="text-sm font-semibold text-slate-800">Staff Directory</h2>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition-all text-xs font-normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredStaff.map(staff => (
            <button
              key={staff.id}
              onClick={() => setSelectedStaffId(staff.id)}
              className={`w-full text-left p-2.5 rounded-xl transition-all group flex items-center gap-2.5 cursor-pointer border-none ${
                selectedStaffId === staff.id 
                  ? 'bg-[#3D1D3F] text-white shadow-sm' 
                  : 'hover:bg-slate-50 bg-transparent text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${
                selectedStaffId === staff.id ? 'bg-white/15 text-white' : `${staff.avatarColor} text-white`
              }`}>
                {getInitials(staff.name)}
              </div>
              <div className="flex-1 truncate min-w-0">
                <div className={`font-semibold text-sm truncate ${selectedStaffId === staff.id ? 'text-white' : 'text-slate-800'}`}>
                  {staff.name}
                </div>
                <div className={`text-[11px] truncate font-normal ${selectedStaffId === staff.id ? 'text-white/50' : 'text-slate-400'}`}>
                  {staff.department}
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${selectedStaffId === staff.id ? 'text-white/60' : 'text-slate-300 group-hover:text-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Diary View */}
      <div className="space-y-4">
        {selectedStaff ? (
          <>
            {/* Header */}
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm shrink-0 ${selectedStaff.avatarColor} text-white`}>
                    {getInitials(selectedStaff.name)}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-base font-semibold text-slate-900 truncate">{selectedStaff.name}'s Diary</h1>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="flex items-center gap-1 text-slate-400"><Briefcase className="w-3 h-3" /> {selectedStaff.role}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                      <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">{selectedStaff.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg flex items-center px-2.5 py-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                    <span className="font-medium text-slate-700 tabular-nums text-xs">{selectedDate}</span>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#C20F47] hover:bg-[#3D1D3F] text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 text-xs cursor-pointer border-none whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Task
                  </button>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Completion</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">{progressPercent}%</div>
                </div>
                <div className="w-10 h-10 rounded-full border-[3px] border-slate-100 flex items-center justify-center relative shrink-0">
                  <svg className="w-full h-full absolute top-0 left-0 -rotate-90 text-indigo-500" viewBox="0 0 36 36">
                     <path className="stroke-current" strokeWidth="4" strokeDasharray={`${progressPercent}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <TrendingUp className="w-4 h-4 text-indigo-500 z-10" />
                </div>
              </div>
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3 shadow-sm">
                <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Tasks logged</div>
                <div className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">{totalCount} <span className="text-xs font-normal text-slate-400">sessions</span></div>
              </div>
              <div className="bg-indigo-50/60 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                   <div className="text-indigo-400 text-[10px] font-medium uppercase tracking-wide">Next up</div>
                   <div className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 mt-0.5">
                     {selectedStaff.entries.find(e => e.status === 'pending')?.title || 'Schedule clear'}
                   </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {selectedStaff.entries.length > 0 ? (
              <div className="relative pl-9 pb-2">
                <div className="absolute top-2 bottom-4 left-[15px] w-px bg-slate-200"></div>

                <div className="space-y-3">
                  {selectedStaff.entries.map((entry) => {
                    const style = getTypeStyle(entry.type);
                    const isDone = entry.status === 'completed';
                    return (
                      <div key={entry.id} className={`group relative flex items-start gap-3 transition-all ${isDone ? 'opacity-80' : ''}`}>
                        
                        {/* Node */}
                        <button 
                          onClick={() => toggleStatus(entry.id, entry.status)}
                          className={`absolute -left-9 top-3 w-5 h-5 rounded-full flex items-center justify-center transition-all bg-white ring-4 ring-white cursor-pointer border-none ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                        >
                          {isDone ? <CheckCircle2 className="w-full h-full" /> : <Circle className="w-full h-full" />}
                        </button>

                        {/* Card content */}
                        <div className={`flex-1 rounded-[1.25rem] border p-3.5 transition-shadow relative overflow-hidden ${style.bg} ${style.border} ${isDone ? 'opacity-70 saturate-50' : 'shadow-sm hover:shadow-md'}`}>
                          <style.icon className="absolute -right-3 -bottom-3 w-20 h-20 opacity-[0.04] text-current" />

                          <div className="flex justify-between items-start gap-2 relative z-10">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] capitalize font-medium border bg-white/60 ${style.text} ${style.border}`}>
                                  <style.icon className="w-3 h-3" />
                                  {entry.type}
                                </span>
                                {entry.addedBy === 'admin' && (
                                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                                    Assigned
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-sm font-semibold ${isDone ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>{entry.title}</h3>
                            </div>
                            
                            <div className={`text-xs font-medium tabular-nums shrink-0 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                              {entry.startTime}–{entry.endTime}
                            </div>
                          </div>
                          
                          {entry.details && (
                            <p className={`mt-2 text-xs ${isDone ? 'text-slate-400' : 'text-slate-500'} border-t border-slate-200/50 pt-2 relative z-10`}>
                              {entry.details}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-8 text-center shadow-sm">
                <CalendarIcon className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">Schedule is clear</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">No tasks for {selectedDate}.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-[#C20F47] font-medium text-xs hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
                >
                  <Plus className="w-3.5 h-3.5" /> Start planning
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-12 text-center shadow-sm text-slate-400 text-sm">
            Select a staff member
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-semibold text-sm">Add Diary Log</h3>
                  <p className="text-[11px] text-white/50 mt-0.5">Assign task to {selectedStaff?.name}</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
            </div>
            
            <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Entry Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['class', 'co-curricular', 'admin', 'other'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewEntry({...newEntry, type: t})}
                      className={`py-2 px-2.5 rounded-lg text-[11px] font-medium capitalize transition-all border cursor-pointer ${
                        newEntry.type === t 
                          ? 'bg-[#3D1D3F] text-white border-[#3D1D3F] shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Title / Focus</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-900 transition-all text-sm"
                  value={newEntry.title || ''}
                  onChange={e => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="e.g. Form 4 marking"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium tabular-nums text-slate-800 transition-all cursor-pointer text-sm"
                    value={newEntry.startTime || ''}
                    onChange={e => setNewEntry({...newEntry, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">End Time</label>
                  <input 
                    type="time" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium tabular-nums text-slate-800 transition-all cursor-pointer text-sm"
                    value={newEntry.endTime || ''}
                    onChange={e => setNewEntry({...newEntry, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Additional Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-normal text-slate-900 transition-all resize-none h-20 text-sm"
                  value={newEntry.details || ''}
                  onChange={e => setNewEntry({...newEntry, details: e.target.value})}
                  placeholder="Add details, room numbers, or requirements..."
                />
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm cursor-pointer border-none bg-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEntry}
                className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 text-sm cursor-pointer border-none"
              >
                Save Log
              </button>
             </div>
          </div>
        </div>, document.body
      )}

    </div>
  );
}
