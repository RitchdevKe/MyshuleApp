"use client";

import React, { useState, useEffect } from "react";
import { MonitorSmartphone, Search, Filter, Upload, Download, FileText, Headphones, Video, CheckCircle2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createDigitalResource, deleteDigitalResource, downloadDigitalResource } from "./actions";

type DigitalResource = {
  id: string;
  title: string;
  author: string | null;
  type: string;
  size: string | null;
  status: string;
  downloads: number;
  createdAt: Date;
};

export default function DigitalLibraryClient({ initialResources }: { initialResources: DigitalResource[] }) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", type: "PDF (E-Book)", size: "0 MB" });

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const getFormatIcon = (format: string) => {
    if (format.includes('PDF')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (format.includes('Audio')) return <Headphones className="w-5 h-5 text-purple-500" />;
    if (format.includes('Video')) return <Video className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    (r.author && r.author.toLowerCase().includes(search.toLowerCase())) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDigitalResource({
      title: formData.title,
      author: formData.author,
      type: formData.type,
      size: formData.size,
      status: "Active"
    });
    setIsModalOpen(false);
    setFormData({ title: "", author: "", type: "PDF (E-Book)", size: "0 MB" });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setResources(resources.filter(r => r.id !== id));
    await deleteDigitalResource(id);
    router.refresh();
  };

  const handleDownload = async (id: string) => {
    // Optimistic UI update
    setResources(resources.map(r => r.id === id ? { ...r, downloads: r.downloads + 1 } : r));
    await downloadDigitalResource(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Cards (Requirement 3: Update the Top Cards to show real aggregated data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
            <MonitorSmartphone className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Resources</p>
            <p className="text-3xl font-black text-slate-800">{resources.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Download className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Downloads</p>
            <p className="text-3xl font-black text-slate-800">{resources.reduce((acc, curr) => acc + curr.downloads, 0)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Resources</p>
            <p className="text-3xl font-black text-slate-800">{resources.filter(r => r.status === 'Active').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <MonitorSmartphone className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Digital Library</h2>
                 <p className="text-sm font-medium text-slate-500">Manage e-books, audiobooks, past papers, and digital resources.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Upload className="w-4 h-4" />
              Upload Resource
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Title, Author, or Format..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Formats</option>
                 <option>PDF (E-Book)</option>
                 <option>PDF (Document)</option>
                 <option>MP3 (Audiobook)</option>
                 <option>MP4 (Video)</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Format & Size</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Engagement</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredResources.map((resource) => (
                   <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{resource.title}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{resource.id.substring(0, 8)}</span>
                           <span className="text-[10px] font-medium text-slate-500">by {resource.author || 'Unknown'}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           {getFormatIcon(resource.type)}
                           <span className="font-bold text-slate-700 text-sm">{resource.type}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{resource.size || 'Unknown Size'}</span>
                     </td>
                     <td className="py-4 px-6 text-center">
                        <div className="inline-flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl min-w-[80px]">
                           <span className="text-lg font-black text-slate-800">{resource.downloads}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Download className="w-3 h-3" /> Downloads
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                         resource.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {resource.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {resource.status}
                       </span>
                       <p className="text-[10px] font-medium text-slate-400 mt-1">Added: {new Date(resource.createdAt).toLocaleDateString()}</p>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleDownload(resource.id)} className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                             <Download className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(resource.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex">
                             <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {filteredResources.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                         No resources found.
                      </td>
                    </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-800 mb-4">Upload Resource</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Author</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Format</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>PDF (E-Book)</option>
                  <option>PDF (Document)</option>
                  <option>MP3 (Audiobook)</option>
                  <option>MP4 (Video)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">File Size (mock)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900 focus:outline-none"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold transition-colors"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
