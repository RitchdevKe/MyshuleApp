"use client";

import React, { useState } from "react";
import { Users, Activity, Trophy, Map, Star, ChevronRight, X, Calendar as CalendarIcon } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-sm text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ActivitiesOverview() {
  const [stats, setStats] = useState({
    activeClubs: 24,
    sportsTeams: 12,
    totalMemberships: 1284,
    achievements: 86
  });

  const [upcomingActivities, setUpcomingActivities] = useState([
    { title: "Football Training", entity: "School Football U16", time: "Today, 4:00 PM", type: "Sport" },
    { title: "Debate Competition Prep", entity: "Debate Club", time: "Today, 4:30 PM", type: "Club" },
    { title: "Museum Educational Trip", entity: "Grade 8", time: "Tomorrow, 8:00 AM", type: "Trip" },
    { title: "Science Fair", entity: "Science Club", time: "Friday, 2:00 PM", type: "Event" },
  ]);

  const [recentAchievements, setRecentAchievements] = useState([
    { title: "County Chess Champion", student: "Mary Wanjiku", category: "Sports" },
    { title: "Best Debater Award", student: "John Kamau", category: "Clubs" },
    { title: "Environmental Project", student: "Green Club", category: "Community" },
  ]);

  const [modalState, setModalState] = useState<{ isOpen: boolean, type: string, data: any }>({
    isOpen: false,
    type: "",
    data: null
  });

  const openModal = (type: string, data: any = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "", data: null });
  };

  return (
    <div className="p-8 space-y-8 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-700 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-indigo-700">{stats.activeClubs}</div>
          <div className="text-sm font-bold text-indigo-600/70 uppercase tracking-wider mt-1">Active Clubs</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-700 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-700">{stats.sportsTeams}</div>
          <div className="text-sm font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Sports Teams</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-slate-100/60 to-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-slate-200/50 text-slate-700 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-800">{stats.totalMemberships.toLocaleString()}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Total Memberships</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-700 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-amber-700">{stats.achievements}</div>
          <div className="text-sm font-bold text-amber-600/70 uppercase tracking-wider mt-1">Achievements</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Activities */}
        <div className="lg:col-span-2 bg-white/60 border border-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Upcoming Activities</h3>
            <button 
              onClick={() => openModal('calendar')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              View Calendar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingActivities.map((act, idx) => (
              <div 
                key={idx} 
                onClick={() => openModal('activity', act)}
                className="p-4 bg-white/80 border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4 hover:-translate-y-1 hover:border-indigo-200 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  act.type === 'Sport' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  act.type === 'Club' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                  act.type === 'Trip' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-purple-50 text-purple-600 border-purple-100'
                }`}>
                  {act.type === 'Sport' && <Activity className="w-6 h-6" />}
                  {act.type === 'Club' && <Users className="w-6 h-6" />}
                  {act.type === 'Trip' && <Map className="w-6 h-6" />}
                  {act.type === 'Event' && <Star className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{act.title}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">{act.entity}</p>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-2">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/50 border border-amber-100/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" /> Recent Achievements
          </h3>
          <div className="space-y-4">
            {recentAchievements.map((ach, idx) => (
              <div 
                key={idx} 
                onClick={() => openModal('achievement', ach)}
                className="p-4 bg-white/90 border border-amber-100/50 rounded-2xl flex flex-col hover:-translate-y-1 hover:shadow-md transition-all shadow-sm group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1.5">{ach.category}</span>
                <span className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">{ach.title}</span>
                <span className="text-xs font-medium text-slate-500 mt-1">{ach.student}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => openModal('trophy')}
            className="w-full mt-6 py-3 bg-amber-100/50 hover:bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            View Trophy Cabinet
          </button>
        </div>
        
      </div>

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={
          modalState.type === 'calendar' ? 'Activities Calendar' : 
          modalState.type === 'trophy' ? 'Trophy Cabinet' : 
          modalState.type === 'activity' ? 'Activity Details' : 
          modalState.type === 'achievement' ? 'Achievement Details' : ''
        }
      >
        {modalState.type === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
              <div className="text-center">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Full calendar view would be displayed here.</p>
                <p className="text-xs text-slate-400 mt-1">Calendar module not fully implemented yet.</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">Close</button>
            </div>
          </div>
        )}
        
        {modalState.type === 'trophy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-bold text-amber-900">1st Place</h4>
                <p className="text-xs text-amber-700 mt-1">National Science Fair</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700">2nd Place</h4>
                <p className="text-xs text-slate-500 mt-1">County Debate</p>
              </div>
            </div>
            <p className="text-center text-slate-500 mt-4 italic">More achievements will appear here as they are recorded.</p>
          </div>
        )}

        {modalState.type === 'activity' && modalState.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                modalState.data.type === 'Sport' ? 'bg-emerald-100 text-emerald-600' :
                modalState.data.type === 'Club' ? 'bg-indigo-100 text-indigo-600' :
                modalState.data.type === 'Trip' ? 'bg-amber-100 text-amber-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {modalState.data.type === 'Sport' && <Activity className="w-6 h-6" />}
                {modalState.data.type === 'Club' && <Users className="w-6 h-6" />}
                {modalState.data.type === 'Trip' && <Map className="w-6 h-6" />}
                {modalState.data.type === 'Event' && <Star className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800">{modalState.data.title}</h4>
                <p className="text-slate-500 font-medium">{modalState.data.entity}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                <p className="font-medium text-slate-800">{modalState.data.time}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                <p className="font-medium text-slate-800">{modalState.data.type}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <button onClick={closeModal} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => {
                alert(`Registering for ${modalState.data.title}...`);
                closeModal();
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Register Interest</button>
            </div>
          </div>
        )}

        {modalState.type === 'achievement' && modalState.data && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h4 className="font-black text-xl text-amber-900">{modalState.data.title}</h4>
              <p className="text-amber-700 mt-2 font-medium">Awarded to <span className="font-bold">{modalState.data.student}</span></p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
              <p className="font-medium text-slate-800">{modalState.data.category}</p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
