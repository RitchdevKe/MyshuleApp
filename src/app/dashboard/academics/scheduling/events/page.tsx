"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, Calendar, Users, MapPin, Clock, Edit2, Trash2, X } from "lucide-react";

type EventType = "Academic" | "Sports" | "Meetings" | "Other";
type EventStatus = "Upcoming" | "Completed" | "Ongoing";

interface SchoolEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  audience: string;
  status: EventStatus;
  type: EventType;
}

const initialEvents: SchoolEvent[] = [
  { id: "EVT-001", name: "Science Fair", date: "2026-06-20", time: "09:00 AM", location: "Main Hall", audience: "All Students, Parents", status: "Upcoming", type: "Academic" },
  { id: "EVT-002", name: "PTA Meeting", date: "2026-06-15", time: "02:00 PM", location: "Staff Room", audience: "Parents, Teachers", status: "Completed", type: "Meetings" },
  { id: "EVT-003", name: "Sports Day", date: "2026-07-10", time: "08:00 AM", location: "School Field", audience: "All Students", status: "Upcoming", type: "Sports" },
  { id: "EVT-004", name: "Mid-term Break", date: "2026-06-25", time: "All Day", location: "N/A", audience: "School-wide", status: "Upcoming", type: "Academic" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All Event Types");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [formData, setFormData] = useState<Partial<SchoolEvent>>({});

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Upcoming": return "bg-blue-100/80 text-blue-700 border-blue-200";
      case "Completed": return "bg-slate-100/80 text-slate-700 border-slate-200";
      case "Ongoing": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  // Derived state
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ev.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "All Event Types" || ev.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, filterType]);

  // Summary stats
  const totalEvents = events.length;
  const upcomingCount = events.filter(e => e.status === "Upcoming").length;
  const completedCount = events.filter(e => e.status === "Completed").length;
  const academicCount = events.filter(e => e.type === "Academic").length;

  const handleOpenModal = (event?: SchoolEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData(event);
    } else {
      setEditingEvent(null);
      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        audience: "",
        status: "Upcoming",
        type: "Academic"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      // Update
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData } as SchoolEvent : ev));
    } else {
      // Create
      const newEvent: SchoolEvent = {
        ...(formData as SchoolEvent),
        id: `EVT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      };
      setEvents([...events, newEvent]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: totalEvents, icon: Calendar, color: "text-primary-900", bg: "bg-primary-50" },
          { label: "Upcoming", value: upcomingCount, icon: Clock, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Completed", value: completedCount, icon: MapPin, color: "text-slate-700", bg: "bg-slate-100" },
          { label: "Academic Events", value: academicCount, icon: Users, color: "text-emerald-700", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Event Types</option>
              <option>Academic</option>
              <option>Sports</option>
              <option>Meetings</option>
              <option>Other</option>
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No events found.
                  </td>
                </tr>
              ) : filteredEvents.map((row) => (
                <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.name}</span>
                        <span className="text-xs font-bold text-slate-400">{row.id} • {row.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5"><Calendar className="w-3 h-3" />{row.date}</span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Clock className="w-3 h-3" />{row.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {row.location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      {row.audience}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <form id="event-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Event Name</label>
                    <input 
                      required
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Date</label>
                    <input 
                      required
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Time</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g., 09:00 AM or All Day"
                      value={formData.time || ""}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Location</label>
                    <input 
                      required
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Audience</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g., All Students, Parents"
                      value={formData.audience || ""}
                      onChange={(e) => setFormData({...formData, audience: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Event Type</label>
                    <select 
                      value={formData.type || "Academic"}
                      onChange={(e) => setFormData({...formData, type: e.target.value as EventType})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Meetings">Meetings</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Status</label>
                    <select 
                      value={formData.status || "Upcoming"}
                      onChange={(e) => setFormData({...formData, status: e.target.value as EventStatus})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="event-form"
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
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