"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Video, MonitorPlay, FileText, Upload, X, 
  Library
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// A reusable modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesOverviewPage() {
  // Use state to hold simulated data
  const [stats, setStats] = useState({
    libraryBooks: 0,
    materials: 0,
    elearning: 0,
    videos: 0,
    pastPapers: 0
  });

  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    let isMounted = true;
    
    // In the future this can be replaced with a real server action call
    // e.g. const data = await getResourcesOverviewStats();
    setTimeout(() => {
      if (!isMounted) return;
      setStats({
        libraryBooks: 342,
        materials: 1248,
        elearning: 45,
        videos: 86,
        pastPapers: 320
      });
      
      setRecentUploads([
        { id: 1, title: "Grade 4 Science Notes", type: "Material", date: "Today, 10:00 AM", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 2, title: "Fractions Tutorial", type: "Video", date: "Yesterday, 2:30 PM", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
        { id: 3, title: "Term 2 KCPE Past Paper", type: "Past Paper", date: "2 days ago", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
      ]);

      setUsageData([
        { name: "Mon", downloads: 40, views: 24 },
        { name: "Tue", downloads: 30, views: 13 },
        { name: "Wed", downloads: 20, views: 98 },
        { name: "Thu", downloads: 27, views: 39 },
        { name: "Fri", downloads: 18, views: 48 },
      ]);
    }, 800);
    
    return () => { isMounted = false; };
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Uploading resource... (Simulated)`);
    setActiveModal(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Resources Overview
          </h2>
          <p className="text-slate-500 font-medium mt-1 text-sm">
            Quickly glance at your school's digital assets and recent activities.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveModal('upload')}
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-700 to-primary-900 rounded-xl hover:from-primary-800 hover:to-primary-950 transition-all shadow-md shadow-primary-900/20"
          >
            <Upload className="w-4 h-4 text-primary-200" />
            Quick Upload
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Library Books</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">
                {stats.libraryBooks || "..."}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Library className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Study Materials</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">
                {stats.materials || "..."}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">E-Learning</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">
                {stats.elearning || "..."}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <MonitorPlay className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Video Hub</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">
                {stats.videos || "..."}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Video className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6">Resource Usage (This Week)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="downloads" name="Downloads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" name="Views" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6">Recently Uploaded</h3>
          <div className="space-y-4">
            {recentUploads.length === 0 ? (
              <p className="text-slate-500 text-sm">Loading recent activity...</p>
            ) : (
              recentUploads.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs font-bold text-slate-400">{item.type} &bull; {item.date}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Reusable Upload Modal */}
      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)} title="Upload Resource">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
            <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none" required placeholder="Enter resource title..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Resource Type</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 outline-none">
              <option>Study Material</option>
              <option>Digital Library Book</option>
              <option>Past Paper</option>
              <option>Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">File</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">Click to browse or drag &amp; drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, MP4, or DOCX up to 50MB</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm transition-colors">
              Upload Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
