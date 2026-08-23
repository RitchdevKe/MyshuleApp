"use client";

import React from "react";
import { MonitorSmartphone, Search, Filter, Upload, Download, FileText, Headphones, Video, CheckCircle2 } from "lucide-react";

export default function DigitalLibraryPage() {
  const digitalResources = [
    { id: "DIG-101", title: "Complete Physics for Cambridge IGCSE", author: "Stephen Pople", format: "PDF (E-Book)", size: "45.2 MB", uploads: "Aug 01, 2024", downloads: 142, status: "Active" },
    { id: "DIG-102", title: "Past Paper - Math 2023", author: "Exam Board", format: "PDF (Document)", size: "2.1 MB", uploads: "Aug 05, 2024", downloads: 89, status: "Active" },
    { id: "DIG-103", title: "Macbeth Audio Play", author: "William Shakespeare", format: "MP3 (Audiobook)", size: "120.5 MB", uploads: "Jul 15, 2024", downloads: 56, status: "Active" },
    { id: "DIG-104", title: "Cellular Biology Visualization", author: "Science Dept", format: "MP4 (Video)", size: "350.8 MB", uploads: "Jul 22, 2024", downloads: 215, status: "Active" },
    { id: "DIG-105", title: "History Revision Guide", author: "John Smith", format: "PDF (E-Book)", size: "15.4 MB", uploads: "Aug 10, 2024", downloads: 12, status: "Draft" },
  ];

  const getFormatIcon = (format: string) => {
    if (format.includes('PDF')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (format.includes('Audio')) return <Headphones className="w-5 h-5 text-purple-500" />;
    if (format.includes('Video')) return <Video className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
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
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Upload className="w-4 h-4" />
              Upload Resource
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Title, Author, or Format..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
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
                 {digitalResources.map((resource) => (
                   <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{resource.title}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{resource.id}</span>
                           <span className="text-[10px] font-medium text-slate-500">by {resource.author}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           {getFormatIcon(resource.format)}
                           <span className="font-bold text-slate-700 text-sm">{resource.format}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{resource.size}</span>
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
                       <p className="text-[10px] font-medium text-slate-400 mt-1">Added: {resource.uploads}</p>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <Download className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
