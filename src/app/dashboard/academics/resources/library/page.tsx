"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, Book, Download, ExternalLink, BookOpen, Edit, Trash2, X } from "lucide-react";

type LibraryItem = {
  id: string;
  title: string;
  author: string;
  subject: string;
  classLevel: string;
  type: string;
  status: "Available" | "Checked Out" | string;
};

const initialLibrary: LibraryItem[] = [
  { id: "LIB-001", title: "Primary Mathematics Book 4", author: "Ministry of Education", subject: "Mathematics", classLevel: "Class 4", type: "Textbook", status: "Available" },
  { id: "LIB-002", title: "Exploring Science Vol 1", author: "Sarah Jenkins", subject: "Science", classLevel: "Class 1", type: "Reference", status: "Available" },
  { id: "LIB-003", title: "African Short Stories", author: "Various Authors", subject: "Literature", classLevel: "All Classes", type: "Anthology", status: "Checked Out" },
  { id: "LIB-004", title: "English Grammar Guide", author: "Oxford Press", subject: "English", classLevel: "All Classes", type: "Reference", status: "Available" },
];

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>(initialLibrary);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", author: "", subject: "Mathematics", classLevel: "All Classes", type: "Textbook", status: "Available"
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Checked Out": return "bg-amber-100/80 text-amber-700 border-amber-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "All Subjects" || item.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [items, searchQuery, subjectFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter(i => i.status === "Available").length;
    const checkedOut = items.filter(i => i.status === "Checked Out").length;
    return { total, available, checkedOut };
  }, [items]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", author: "", subject: "Mathematics", classLevel: "All Classes", type: "Textbook", status: "Available" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: LibraryItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setItems(items.map(i => i.id === editingId ? { ...formData, id: editingId } as LibraryItem : i));
    } else {
      const newId = `LIB-${String(items.length + 1).padStart(3, '0')}`;
      setItems([...items, { ...formData, id: newId } as LibraryItem]);
    }
    setIsModalOpen(false);
  };

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(items.map(i => i.subject));
    return ["All Subjects", ...Array.from(subjects)];
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-900 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Resources</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Available Books</p>
            <p className="text-2xl font-black text-slate-800">{stats.available}</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Checked Out</p>
            <p className="text-2xl font-black text-slate-800">{stats.checkedOut}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search digital library..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              {uniqueSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Book
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Title & Author</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-bold">
                    No resources found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <Book className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.title}</span>
                          <span className="text-xs font-bold text-slate-400">{row.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.subject}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.classLevel}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(row)} className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
          <span>Showing {filteredItems.length} of {items.length} books</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800">
                {editingId ? "Edit Resource" : "Add New Resource"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900" 
                    placeholder="Enter resource title"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Author / Publisher</label>
                  <input 
                    type="text" 
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900" 
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Class Level</label>
                  <input 
                    type="text" 
                    required
                    value={formData.classLevel}
                    onChange={(e) => setFormData({...formData, classLevel: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900"
                  >
                    <option value="Textbook">Textbook</option>
                    <option value="Reference">Reference</option>
                    <option value="Anthology">Anthology</option>
                    <option value="Journal">Journal</option>
                    <option value="Magazine">Magazine</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900"
                  >
                    <option value="Available">Available</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm shadow-primary-900/20"
                >
                  {editingId ? "Save Changes" : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
