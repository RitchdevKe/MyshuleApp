"use client";

import React, { useState } from "react";
import { Map, Calendar, MapPin, Search, Plus, Users, Edit, Trash2, X, Check, Clock, AlertCircle } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  group: string;
  date: string;
  location: string;
  status: "Approved" | "Planning" | "Pending Approval";
  cost: string;
};

const initialEvents: EventItem[] = [
  { id: "1", title: "National Museum Trip", group: "Grade 8 Students", date: "Oct 15, 2026", location: "Nairobi National Museum", status: "Approved", cost: "$15" },
  { id: "2", title: "Science Fair 2026", group: "All Students & Staff", date: "Nov 02, 2026", location: "Main Hall", status: "Planning", cost: "Free" },
  { id: "3", title: "Drama Club Retreat", group: "Drama Club Students", date: "Nov 12-14, 2026", location: "Naivasha Arts Center", status: "Pending Approval", cost: "$120" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [formData, setFormData] = useState<Omit<EventItem, "id">>({
    title: "",
    group: "All Students",
    date: "",
    location: "",
    status: "Planning",
    cost: "",
  });

  // Derived state for summary cards
  const totalEvents = events.length;
  const approvedCount = events.filter(e => e.status === "Approved").length;
  const planningCount = events.filter(e => e.status === "Planning").length;
  const pendingCount = events.filter(e => e.status === "Pending Approval").length;

  const filteredEvents = events.filter((evt) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (evt?: EventItem) => {
    if (evt) {
      setEditingEvent(evt);
      setFormData({
        title: evt.title,
        group: evt.group,
        date: evt.date,
        location: evt.location,
        status: evt.status,
        cost: evt.cost,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        group: "All Students",
        date: "",
        location: "",
        status: "Planning",
        cost: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(evt => evt.id === editingEvent.id ? { ...formData, id: evt.id } : evt));
    } else {
      const newEvent: EventItem = {
        ...formData,
        id: Math.random().toString(36).substring(7),
      };
      setEvents([...events, newEvent]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(evt => evt.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Events & Trips</h2>
            <p className="text-xs font-bold text-slate-500">Coordinate off-campus trips and major school events</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Plan Event
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Events</p>
            <p className="text-xl font-black text-slate-800">{totalEvents}</p>
          </div>
        </div>
        
        <div className="bg-white/80 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Approved</p>
            <p className="text-xl font-black text-slate-800">{approvedCount}</p>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Planning</p>
            <p className="text-xl font-black text-slate-800">{planningCount}</p>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pending Approval</p>
            <p className="text-xl font-black text-slate-800">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-3xl border border-slate-200/60">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No events found.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id} 
              onClick={() => handleOpenModal(evt)}
              className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex flex-col items-center justify-center border border-amber-100 flex-shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {evt.date.split(" ")[0] || "TBD"}
                  </span>
                  <span className="text-xl font-black">
                    {evt.date.split(" ")[1]?.replace(",", "") || "-"}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-amber-700 transition-colors pr-8 md:pr-0">
                    {evt.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.group}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {evt.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fee</div>
                  <div className="text-sm font-bold text-slate-700">{evt.cost}</div>
                </div>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm whitespace-nowrap ${
                  evt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  evt.status === 'Planning' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {evt.status}
                </span>

                <button 
                  onClick={(e) => handleDelete(evt.id, e)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">
                {editingEvent ? "Edit Event" : "Plan New Event"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="event-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="e.g., Annual Science Fair"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Group</label>
                    <select
                      value={formData.group}
                      onChange={e => setFormData({...formData, group: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="All Students">All Students</option>
                      <option value="All Staff">All Staff</option>
                      <option value="All Students & Staff">All Students & Staff</option>
                      <option value="Grade 8 Students">Grade 8 Students</option>
                      <option value="Grade 12 Students">Grade 12 Students</option>
                      <option value="Drama Club Students">Drama Club Students</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="e.g., Oct 15, 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="e.g., Main Hall"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cost / Fee</label>
                    <input
                      type="text"
                      required
                      value={formData.cost}
                      onChange={e => setFormData({...formData, cost: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="e.g., Free, $15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="event-form"
                className="px-6 py-2 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
              >
                {editingEvent ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
