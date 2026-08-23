"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, Video, Play, ExternalLink, Edit2, Trash2, X, Eye, Clock } from "lucide-react";

interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  duration: string;
  views: number;
  date: string;
}

const initialVideos: VideoLesson[] = [
  { id: "VID-001", title: "Adding Fractions with Different Denominators", subject: "Mathematics", targetClass: "Grade 4", duration: "15:20", views: 245, date: "2026-07-10" },
  { id: "VID-002", title: "The Water Cycle Explained", subject: "Science", targetClass: "Grade 5", duration: "08:45", views: 180, date: "2026-07-15" },
  { id: "VID-003", title: "Types of Sentences", subject: "English", targetClass: "Grade 4", duration: "12:10", views: 95, date: "2026-07-20" },
  { id: "VID-004", title: "Our Physical Environment", subject: "Social Studies", targetClass: "Grade 6", duration: "20:00", views: 310, date: "2026-08-02" },
];

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoLesson[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  
  // Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "Mathematics",
    targetClass: "Grade 4",
    duration: "",
  });

  const filteredVideos = useMemo(() => {
    return videos.filter(v => 
      (subjectFilter === "All Subjects" || v.subject === subjectFilter) &&
      (v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.targetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [videos, searchQuery, subjectFilter]);

  // Derived stats for top summary card
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const avgDurationStr = useMemo(() => {
    if (videos.length === 0) return "00:00";
    const totalSeconds = videos.reduce((acc, v) => {
      const [mins, secs] = v.duration.split(':').map(Number);
      return acc + (mins * 60 + secs);
    }, 0);
    const avgSecs = Math.floor(totalSeconds / videos.length);
    const m = Math.floor(avgSecs / 60).toString().padStart(2, '0');
    const s = (avgSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [videos]);

  const handleOpenModal = (vid?: VideoLesson) => {
    if (vid) {
      setEditingVideo(vid);
      setFormData({
        title: vid.title,
        subject: vid.subject,
        targetClass: vid.targetClass,
        duration: vid.duration,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: "",
        subject: "Mathematics",
        targetClass: "Grade 4",
        duration: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...formData } : v));
    } else {
      const newIdNumber = videos.length > 0 ? Math.max(...videos.map(v => parseInt(v.id.replace("VID-", "")))) + 1 : 1;
      const newId = `VID-${newIdNumber.toString().padStart(3, '0')}`;
      const newVideo: VideoLesson = {
        id: newId,
        title: formData.title,
        subject: formData.subject,
        targetClass: formData.targetClass,
        duration: formData.duration,
        views: 0,
        date: new Date().toISOString().split('T')[0],
      };
      setVideos([...videos, newVideo]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Total Videos</span>
          <span className="text-3xl font-black text-slate-800 mt-2">{totalVideos}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Total Views</span>
          <span className="text-3xl font-black text-primary-600 mt-2 flex items-center gap-2">
            <Eye className="w-6 h-6" /> {totalViews}
          </span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Average Duration</span>
          <span className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-2">
            <Clock className="w-6 h-6" /> {avgDurationStr}
          </span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search video lessons..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>Social Studies</option>
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Upload Video
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Video Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Date Uploaded</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-bold">
                    No videos found.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors relative flex items-center justify-center">
                          <Video className="w-4 h-4" />
                          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.title}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.subject}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.targetClass}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.duration}</td>
                    <td className="px-6 py-4 font-black text-slate-800">{row.views}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(row)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>Showing {filteredVideos.length} of {videos.length} videos</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled={filteredVideos.length <= 10}>Next</button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">
                {editingVideo ? "Edit Video" : "Upload Video"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Video Title
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-all"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Target Class
                  </label>
                  <select 
                    value={formData.targetClass}
                    onChange={(e) => setFormData({...formData, targetClass: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-all"
                  >
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Form 1">Form 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Duration (MM:SS)
                </label>
                <input 
                  type="text" 
                  required
                  pattern="^[0-5]?[0-9]:[0-5][0-9]$"
                  title="Format: MM:SS (e.g. 15:30)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
                  placeholder="15:30"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm transition-colors"
                >
                  {editingVideo ? "Save Changes" : "Upload Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

