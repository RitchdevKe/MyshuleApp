import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  UserPlus, 
  Bell, 
  Mail,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowRight,
  Filter,
  BadgeCheck,
  Building,
  Coffee,
  MoreVertical,
  LogOut,
  TrendingUp,
  List,
  Grid
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: 'Enquiry' | 'Meeting' | 'Delivery' | 'Other';
  purposeDetails?: string;
  whoToSee?: string;
  timeIn: string;
  timeOut?: string;
  status: 'In Premise' | 'Left';
  outcome?: 'Pending' | 'Completed' | 'Rescheduled';
  notes?: string;
  avatarColor: string;
}

interface Meeting {
  id: string;
  visitorName: string;
  staffStudentName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-purple-100 text-purple-700'
];

export function ReceptionistTab() {
  const [activeView, setActiveView] = useState<'live' | 'directory' | 'meetings' | 'enquiries' | 'trends'>('live');
  const [meetingsViewMode, setMeetingsViewMode] = useState<'list' | 'calendar'>('list');
  const [currentTime, setCurrentTime] = useState(new Date());

  const visitorTrendsData = [
    { day: 'Mon', visitors: 14 },
    { day: 'Tue', visitors: 22 },
    { day: 'Wed', visitors: 18 },
    { day: 'Thu', visitors: 26 },
    { day: 'Fri', visitors: 30 },
    { day: 'Sat', visitors: 8 },
    { day: 'Sun', visitors: 3 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Dummy Data representing the receptionist desk's active state
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '1', name: 'John Kamau', phone: '0712345678', purpose: 'Enquiry', purposeDetails: 'Form 1 admission details', timeIn: '08:30', status: 'Left', outcome: 'Completed', notes: 'Asked about Form 1 admissions for 2027.', avatarColor: AVATAR_COLORS[0] },
    { id: '2', name: 'Sarah Ochieng', phone: '0723456789', purpose: 'Meeting', whoToSee: 'Mr. Kiprop (Math)', timeIn: '09:15', status: 'In Premise', outcome: 'Pending', avatarColor: AVATAR_COLORS[1] },
    { id: '3', name: 'DHL Courier', phone: 'N/A', purpose: 'Delivery', timeIn: '10:05', status: 'In Premise', outcome: 'Pending', avatarColor: AVATAR_COLORS[2] },
    { id: '4', name: 'James Mwangi', phone: '0733445566', purpose: 'Other', purposeDetails: 'Fee payment clarification', timeIn: '11:20', status: 'In Premise', outcome: 'Pending', avatarColor: AVATAR_COLORS[3] }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', visitorName: 'Alice Mutua', staffStudentName: 'Student: James Mutua (Form 3)', date: new Date().toISOString().split('T')[0], time: '14:00', status: 'Scheduled' },
    { id: '2', visitorName: 'David Njoku', staffStudentName: 'Mr. Ndungu (Principal)', date: new Date().toISOString().split('T')[0], time: '15:30', status: 'Scheduled', notes: 'Supplier contract renewal' },
    { id: '3', visitorName: 'Dr. Evans', staffStudentName: 'Mrs. Mutua (Languages)', date: '2026-06-11', time: '09:00', status: 'Scheduled', notes: 'Curriculum review' }
  ]);

  const [showNewVisitor, setShowNewVisitor] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('');

  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>(() => {
    try {
      const saved = localStorage.getItem('receptionist_visitor_draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return { purpose: 'Enquiry', status: 'In Premise', outcome: 'Pending' };
  });

  useEffect(() => {
    localStorage.setItem('receptionist_visitor_draft', JSON.stringify(newVisitor));
  }, [newVisitor]);

  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({ status: 'Scheduled', date: new Date().toISOString().split('T')[0] });

  const handleSignOut = (id: string, outcome: 'Completed' | 'Pending' | 'Rescheduled' = 'Completed') => {
    setVisitors(visitors.map(v => v.id === id ? { 
      ...v, 
      status: 'Left', 
      outcome: v.outcome === 'Pending' ? outcome : v.outcome,
      timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
    } : v));
    toast.success('Visitor signed out successfully.');
  };

  const handleUpdateOutcome = (id: string, outcome: 'Pending' | 'Completed' | 'Rescheduled') => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, outcome } : v));
    toast.success(`Visit purpose marked as ${outcome}.`);
  };

  const handleSendReminder = (meeting: Meeting) => {
    toast.success(`Reminder sent via SMS to ${meeting.staffStudentName} for meeting with ${meeting.visitorName}.`);
  };

  const addVisitor = () => {
    if (!newVisitor.name || !newVisitor.phone) {
      toast.error('Please provide name and phone number');
      return;
    }

    if (isScheduling && scheduleDate && scheduleTime) {
      const meeting: Meeting = {
        id: Math.random().toString(36).substr(2, 9),
        visitorName: newVisitor.name as string,
        staffStudentName: newVisitor.whoToSee || 'General Staff',
        date: scheduleDate,
        time: scheduleTime,
        status: 'Scheduled',
        notes: newVisitor.purposeDetails || newVisitor.purpose
      };
      setMeetings([...meetings, meeting]);
      toast.success('Meeting scheduled successfully.');
      handleSendReminder(meeting);
      
      setNewVisitor({ purpose: 'Enquiry', status: 'In Premise', outcome: 'Pending' });
      localStorage.removeItem('receptionist_visitor_draft');
      setShowNewVisitor(false);
      setIsScheduling(false);
      return;
    }

    const visitor: Visitor = {
      ...(newVisitor as Visitor),
      id: Math.random().toString(36).substr(2, 9),
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      outcome: newVisitor.outcome || 'Pending',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };
    setVisitors([visitor, ...visitors]);
    setNewVisitor({ purpose: 'Enquiry', status: 'In Premise', outcome: 'Pending' });
    localStorage.removeItem('receptionist_visitor_draft');
    setShowNewVisitor(false);
    toast.success('Visitor checked in. Badge generated.');

    if (visitor.whoToSee) {
      setTimeout(() => {
        toast.success(`Automated notification sent to ${visitor.whoToSee}.`);
      }, 800);
    }
  };

  const addMeeting = () => {
    if (!newMeeting.visitorName || !newMeeting.staffStudentName || !newMeeting.date || !newMeeting.time) {
      toast.error('Please fill all required fields');
      return;
    }
    const meeting: Meeting = {
      ...(newMeeting as Meeting),
      id: Math.random().toString(36).substr(2, 9)
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({ status: 'Scheduled', date: new Date().toISOString().split('T')[0] });
    setShowNewMeeting(false);
    toast.success('Meeting scheduled successfully.');
    handleSendReminder(meeting); // Auto reminder
  };

  const activeVisitors = visitors.filter(v => v.status === 'In Premise');
  const todaysMeetings = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-semibold text-slate-900">Front Desk</h2>
          <span className="bg-rose-50 text-rose-600 text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1.5 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Live
          </span>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200">
           <div className="text-right pr-3 border-r border-slate-100">
             <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Local time</div>
             <div className="text-sm font-semibold text-slate-800 tabular-nums">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
           </div>
           <button 
            onClick={() => setShowNewVisitor(true)}
            className="bg-[#C20F47] hover:bg-[#3D1D3F] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none whitespace-nowrap"
           >
             <UserPlus className="w-3.5 h-3.5" /> Check-in
           </button>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto gap-1 border border-slate-200">
        {[
          { id: 'live', label: 'Live', icon: Building },
          { id: 'directory', label: 'Directory', icon: Users },
          { id: 'meetings', label: 'Meetings', icon: CalendarIcon },
          { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
          { id: 'trends', label: 'Trends', icon: TrendingUp }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
              activeView === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 bg-transparent'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeView === tab.id ? 'text-[#C20F47]' : 'text-slate-400'}`} /> 
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'live' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column: Active Visitors (Takes 2 columns on XL) */}
          <div className="xl:col-span-2 space-y-3">
            <div className="flex items-center gap-2 px-1">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-800">In Premise</h3>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-medium tabular-nums">{activeVisitors.length}</span>
            </div>

            {activeVisitors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeVisitors.map(visitor => (
                  <div key={visitor.id} className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] p-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex gap-2.5 items-center min-w-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${visitor.avatarColor}`}>
                            {getInitials(visitor.name)}
                            </div>
                            <div className="min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm leading-tight truncate">{visitor.name}</h4>
                            <span className="text-slate-400 text-[11px] font-normal tabular-nums">{visitor.phone}</span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">In</div>
                            <div className="tabular-nums font-semibold text-xs text-slate-700">{visitor.timeIn}</div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg px-2.5 py-2 my-2.5 border border-slate-100">
                    <div className="text-xs text-slate-600 leading-snug">
                        <span className="font-medium text-slate-800">{visitor.purpose}:</span> {visitor.purposeDetails || 'General Visit'}
                    </div>
                    {visitor.whoToSee && (
                        <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> {visitor.whoToSee}
                        </div>
                    )}
                    </div>

                    <button 
                      onClick={() => handleSignOut(visitor.id)}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" /> Check Out
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] p-8 text-center">
                <Coffee className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">No active visitors</h3>
                <p className="text-slate-400 text-xs mt-1">The premises are clear right now.</p>
              </div>
            )}
          </div>

          {/* Right Column: Today's Meetings & Quick Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-800">Today's Schedule</h3>
            </div>

            {/* Daily Metrics Mini */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-[#3D1D3F] rounded-[1.25rem] px-4 py-3 text-white shadow-sm">
                 <div className="text-white/50 text-[11px] font-medium uppercase tracking-wide">Total Visitors</div>
                 <div className="text-2xl font-bold mt-1 tabular-nums">{visitors.length}</div>
               </div>
               <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] px-4 py-3 shadow-sm">
                 <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">Completed</div>
                 <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{visitors.filter(v => v.outcome === 'Completed').length}</div>
               </div>
            </div>
            
            <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[1.25rem] p-4 shadow-sm">
              <div className="space-y-3.5">
                {todaysMeetings.length > 0 ? todaysMeetings.map((meeting, idx) => (
                  <div key={meeting.id} className="relative">
                    {idx !== todaysMeetings.length - 1 && (
                      <div className="absolute left-[7px] top-5 bottom-[-14px] w-px bg-slate-100 z-0"></div>
                    )}
                    <div className="flex gap-2.5 relative z-10">
                       <div className="w-3.5 h-3.5 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="flex items-center gap-1.5 mb-0.5">
                           <span className="tabular-nums text-[11px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{meeting.time}</span>
                           <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${meeting.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{meeting.status}</span>
                         </div>
                         <h4 className="font-semibold text-slate-800 text-sm leading-tight truncate">{meeting.visitorName}</h4>
                         <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">To see: <span className="font-medium text-slate-600">{meeting.staffStudentName}</span></p>
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-slate-400 text-xs">No more meetings today.</div>
                )}
              </div>
               
              <button 
                onClick={() => setShowNewMeeting(true)}
                className="w-full mt-3.5 pt-3.5 border-t border-slate-100 bg-transparent border-x-0 border-b-0 hover:text-[#C20F47] text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarIcon className="w-3.5 h-3.5" /> Schedule new meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'directory' && (
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search visitor history..." 
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-xs font-normal transition"
              />
            </div>
            <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Visitor</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Purpose</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Outcome</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Time</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map(visitor => (
                  <tr key={visitor.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 ${visitor.avatarColor}`}>
                          {getInitials(visitor.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-sm leading-tight truncate">{visitor.name}</div>
                          <div className="text-[11px] text-slate-400 tabular-nums">{visitor.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-top">
                       <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium mb-1">{visitor.purpose}</span>
                      {visitor.whoToSee && <div className="text-[11px] text-indigo-600 font-medium whitespace-nowrap flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {visitor.whoToSee}</div>}
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      <select 
                        className={`text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none border focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer transition-colors ${
                          visitor.outcome === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          visitor.outcome === 'Rescheduled' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        value={visitor.outcome || 'Pending'}
                        onChange={(e) => handleUpdateOutcome(visitor.id, e.target.value as any)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      <div className="flex flex-col gap-1 text-xs tabular-nums font-medium text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5"><span className="w-7 text-slate-400 text-[10px]">IN</span> <span className="bg-slate-100 px-1.5 py-0.5 rounded">{visitor.timeIn}</span></div>
                        <div className="flex items-center gap-1.5"><span className="w-7 text-slate-400 text-[10px]">OUT</span> <span className="bg-slate-100 px-1.5 py-0.5 rounded">{visitor.timeOut || '--:--'}</span></div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-top">
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-medium flex w-fit items-center gap-1.5 ${
                        visitor.status === 'In Premise' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {visitor.status === 'In Premise' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {visitor.status === 'In Premise' ? 'Active' : 'Departed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'meetings' && (
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Meetings Calendar</h3>
              <p className="text-xs text-slate-400 mt-0.5">Staff, student & parent appointments</p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 shrink-0">
                <button
                  onClick={() => setMeetingsViewMode('list')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border-none ${meetingsViewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button
                  onClick={() => setMeetingsViewMode('calendar')}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border-none ${meetingsViewMode === 'calendar' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                >
                  <Grid className="w-3.5 h-3.5" /> Calendar
                </button>
              </div>
              <button 
                onClick={() => setShowNewMeeting(true)}
                className="bg-[#C20F47] hover:bg-[#3D1D3F] text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer border-none flex-1 sm:flex-none"
              >
                <CalendarIcon className="w-3.5 h-3.5" /> New
              </button>
            </div>
          </div>
          
          {meetingsViewMode === 'calendar' ? (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex-1 overflow-x-auto">
              <div className="grid grid-cols-7 gap-2.5 min-w-[760px]">
                {Array.from({ length: 7 }).map((_, i) => {
                  const now = new Date();
                  const currentDay = now.getDay() || 7;
                  const d = new Date(now);
                  d.setDate(now.getDate() - currentDay + 1 + i);
                  
                  const dateStr = d.toISOString().split('T')[0];
                  const dayMeetings = meetings.filter(m => m.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;
                  
                  return (
                    <div key={i} className="flex flex-col gap-2 min-h-[220px]">
                      <div className="text-center pb-2 border-b border-slate-200">
                        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className={`text-sm font-semibold mt-1 w-7 h-7 mx-auto flex items-center justify-center rounded-full tabular-nums ${isToday ? 'bg-[#3D1D3F] text-white shadow-sm' : 'text-slate-700'}`}>
                          {d.getDate()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 flex-1">
                        {dayMeetings.map(meeting => (
                          <div key={meeting.id} className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm hover:border-[#C20F47]/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-0.5 h-full bg-indigo-500"></div>
                            <div className="pl-1">
                              <div className="text-[10px] font-medium tabular-nums text-indigo-600 mb-0.5">{meeting.time}</div>
                              <div className="text-[11px] font-semibold text-slate-700 leading-tight mb-0.5 truncate">{meeting.visitorName}</div>
                              <div className="text-[10px] text-slate-400 leading-tight truncate">{meeting.staffStudentName}</div>
                            </div>
                          </div>
                        ))}
                        {dayMeetings.length === 0 && (
                          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-white/50 min-h-[60px]">
                            <span className="text-[10px] font-medium text-slate-300">None</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1 border-t border-slate-100">
               <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Date & Time</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Visitor</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Staff / Student</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Notes</th>
                  <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meetings.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(meeting => (
                  <tr key={meeting.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800 text-sm">{new Date(meeting.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="text-[10px] font-medium tabular-nums text-indigo-600 bg-indigo-50 w-fit px-1.5 py-0.5 rounded">{meeting.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-slate-700 text-sm">{meeting.visitorName}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-normal text-slate-600 text-xs bg-slate-100 w-fit px-2 py-1 rounded-lg">{meeting.staffStudentName}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-xs text-slate-400 max-w-xs truncate">{meeting.notes || '—'}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-[11px] font-medium ${
                        meeting.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        meeting.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {meeting.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {meetings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                      No meetings scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {activeView === 'enquiries' && (
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-3">
             <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Enquiries Console</h3>
          <p className="text-slate-400 mt-1.5 max-w-sm text-sm leading-relaxed">Admissions, complaints, and parent consultations — coming soon.</p>
          <button onClick={() => setActiveView('live')} className="mt-4 text-[#C20F47] text-xs font-medium hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent">Return to Live Dashboard</button>
        </div>
      )}

      {activeView === 'trends' && (
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm p-5 flex flex-col">
          <div className="mb-3 shrink-0">
            <h3 className="text-sm font-semibold text-slate-800">Weekly Visitor Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5">Visitors logged per day this week</p>
          </div>
          
          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D1D3F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3D1D3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 500, color: '#1e293b' }}
                  itemStyle={{ color: '#3D1D3F' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#3D1D3F" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Modals remain structurally similar but more polished */}
      {showNewVisitor && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-semibold text-sm">Issue Visitor Badge</h3>
                <p className="text-[11px] text-white/50 mt-0.5">Log entry & assign access</p>
              </div>
              <button onClick={() => setShowNewVisitor(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Visitor Name</label>
                  <input 
                    type="text" 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-900 transition-all text-sm" 
                    value={newVisitor.name || ''} 
                    onChange={e => setNewVisitor({...newVisitor, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-900 transition-all text-sm" 
                    value={newVisitor.phone || ''} 
                    onChange={e => setNewVisitor({...newVisitor, phone: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Purpose Category</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-800 transition-all cursor-pointer text-sm"
                    value={newVisitor.purpose}
                    onChange={e => setNewVisitor({...newVisitor, purpose: e.target.value as any})}
                  >
                    <option value="Enquiry">General Enquiry</option>
                    <option value="Meeting">Official Meeting</option>
                    <option value="Delivery">Package Delivery</option>
                    <option value="Other">Other Purpose</option>
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Specific Details <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-normal text-slate-900 transition-all text-sm" 
                    value={newVisitor.purposeDetails || ''} 
                    onChange={e => setNewVisitor({...newVisitor, purposeDetails: e.target.value})} 
                    placeholder="e.g. Form 1 Fees"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Whom to See? <span className="text-slate-400 font-normal">(sends notification)</span></label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-800 transition-all cursor-pointer text-sm" 
                  value={newVisitor.whoToSee || ''} 
                  onChange={e => setNewVisitor({...newVisitor, whoToSee: e.target.value})} 
                >
                  <option value="">-- Non-specific or General --</option>
                  <option value="Mr. Ndungu (Principal)">Mr. Ndungu (Principal)</option>
                  <option value="Mr. Kiprop (Math)">Mr. Kiprop (Math)</option>
                  <option value="Mrs. Mutua (Languages)">Mrs. Mutua (Languages)</option>
                  <option value="Admissions Office">Admissions Office</option>
                  <option value="Finance Department">Finance Department</option>
                  <option value="Head Teacher's Office">Head Teacher's Office</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="schedule-meeting" 
                    className="w-3.5 h-3.5 text-[#C20F47] rounded border-slate-300 focus:ring-[#C20F47]/30"
                    checked={isScheduling}
                    onChange={(e) => setIsScheduling(e.target.checked)}
                  />
                  <label htmlFor="schedule-meeting" className="text-xs font-medium text-slate-600 cursor-pointer">
                    Schedule for later
                  </label>
                </div>
              </div>

              {isScheduling && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                   <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-800 transition-all cursor-pointer text-sm"
                        value={scheduleDate}
                        onChange={e => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium tabular-nums text-slate-800 transition-all cursor-pointer text-sm" 
                        value={scheduleTime} 
                        onChange={e => setScheduleTime(e.target.value)} 
                      />
                    </div>
                </div>
              )}
            </div>
            
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setShowNewVisitor(false)}
                className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm cursor-pointer border-none bg-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={addVisitor}
                className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white font-medium rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 text-sm cursor-pointer border-none"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Generate Pass
              </button>
            </div>
          </div>
        </div>, document.body
      )}

      {showNewMeeting && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] overflow-hidden">
             <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-semibold text-sm">Schedule Meeting</h3>
                <p className="text-[11px] text-white/50 mt-0.5">Book an appointment</p>
              </div>
              <button onClick={() => setShowNewMeeting(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium text-slate-800 transition-all cursor-pointer text-sm"
                      value={newMeeting.date || ''}
                      onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Time</label>
                    <input 
                      type="time" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#C20F47]/20 font-medium tabular-nums text-slate-800 transition-all cursor-pointer text-sm" 
                      value={newMeeting.time || ''} 
                      onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} 
                    />
                  </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Visitor / Parent Name</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 transition-all shadow-sm text-sm" 
                  value={newMeeting.visitorName || ''} 
                  onChange={e => setNewMeeting({...newMeeting, visitorName: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Whom to interact with?</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 transition-all shadow-sm text-sm" 
                  value={newMeeting.staffStudentName || ''} 
                  onChange={e => setNewMeeting({...newMeeting, staffStudentName: e.target.value})} 
                  placeholder="e.g. Mr. Kiprop"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setShowNewMeeting(false)}
                className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm cursor-pointer border-none bg-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={addMeeting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 text-sm cursor-pointer border-none"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Book Schedule
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
