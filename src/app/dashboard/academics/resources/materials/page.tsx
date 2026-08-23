"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, FileText, Download, Edit, Trash2, X } from "lucide-react";
import { getClassesAndStreams } from "@/app/actions/classes";
import { getSubjects } from "@/app/actions/subjects";

interface Material {
  id: string;
  title: string;
  className: string;
  subjectName: string;
  uploadedBy: string;
  date: string;
}

const initialMockMaterials: Material[] = [
  { id: "MAT-001", title: "Fractions Revision Notes", className: "Grade 4", subjectName: "Mathematics", uploadedBy: "Mr. John D.", date: "2026-08-01" },
  { id: "MAT-002", title: "Photosynthesis Diagram", className: "Grade 5", subjectName: "Science", uploadedBy: "Mrs. Sarah K.", date: "2026-08-03" },
  { id: "MAT-003", title: "Creative Writing Prompts", className: "Grade 6", subjectName: "English", uploadedBy: "Ms. Alice M.", date: "2026-08-05" },
  { id: "MAT-004", title: "Map Reading Basics", className: "Grade 4", subjectName: "Social Studies", uploadedBy: "Mr. James O.", date: "2026-08-08" },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMockMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  
  const [dbClasses, setDbClasses] = useState<{id: string, name: string}[]>([]);
  const [dbSubjects, setDbSubjects] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [cls, subjs] = await Promise.all([getClassesAndStreams(), getSubjects()]);
        setDbClasses(cls);
        setDbSubjects(subjs);
      } catch (e) {
        console.error("Error loading classes and subjects", e);
      }
    }
    loadFilterData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    className: "Grade 4",
    subjectName: "Mathematics",
    uploadedBy: "Admin",
  });

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === "All Classes" || m.className === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [materials, searchTerm, selectedClass]);

  const totalMaterials = materials.length;
  const uniqueSubjects = new Set(materials.map(m => m.subjectName)).size;
  // Get dynamic count of the most popular class if possible, or just default to Grade 4
  const grade4Count = materials.filter(m => m.className === "Grade 4").length;

  const handleOpenModal = (material?: Material) => {
    if (material) {
      setEditingId(material.id);
      setFormData({
        title: material.title,
        className: material.className,
        subjectName: material.subjectName,
        uploadedBy: material.uploadedBy,
      });
    } else {
      setEditingId(null);
      setFormData({ 
        title: "", 
        className: dbClasses.length > 0 ? dbClasses[0].name : "Grade 4", 
        subjectName: dbSubjects.length > 0 ? dbSubjects[0].name : "Mathematics", 
        uploadedBy: "Admin" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setMaterials(prev => prev.map(m => 
        m.id === editingId ? { ...m, ...formData } : m
      ));
    } else {
      const newId = `MAT-${String(materials.length + 1).padStart(3, '0')}`;
      const newMaterial = {
        id: newId,
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      setMaterials(prev => [...prev, newMaterial]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const classOptions = dbClasses.length > 0 ? dbClasses.map(c => c.name) : ["Grade 4", "Grade 5", "Grade 6"];
  const subjectOptions = dbSubjects.length > 0 ? dbSubjects.map(s => s.name) : ["Mathematics", "Science", "English", "Social Studies"];

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Total Materials</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{totalMaterials}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Unique Subjects</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{uniqueSubjects}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Grade 4 Materials</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{grade4Count}</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search study materials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Classes</option>
              {classOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Upload Material
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Class & Subject</th>
                <th className="px-6 py-4">Uploaded By</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No materials found.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.title}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{row.className}</span>
                        <span className="text-xs font-bold text-slate-500">{row.subjectName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.uploadedBy}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(row)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"
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
          <span>Showing {filteredMaterials.length} of {materials.length} materials</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Material" : "Upload Material"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. Fractions Revision Notes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                  <select 
                    value={formData.className}
                    onChange={e => setFormData({...formData, className: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    {classOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <select 
                    value={formData.subjectName}
                    onChange={e => setFormData({...formData, subjectName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    {subjectOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Uploaded By</label>
                <input 
                  required
                  type="text" 
                  value={formData.uploadedBy}
                  onChange={e => setFormData({...formData, uploadedBy: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="Your Name"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
                >
                  {editingId ? "Save Changes" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
