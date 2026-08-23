"use client";

import React, { useState, useMemo } from "react";
import { Files, Upload, Search, Filter, Folder, FileText, Image as ImageIcon, MoreVertical, ShieldCheck, AlertTriangle, Edit2, Trash2, X, Download } from "lucide-react";

type DocumentType = "ID Document" | "Tax Form" | "Certification" | "Background Check" | "Other";

interface EmployeeDoc {
  id: number;
  name: string;
  type: DocumentType | string;
  ownerId: string;
  ownerName: string;
  size: string;
  date: string;
}

const mockStaff = [
  { id: "EMP-001", name: "Jane Doe" },
  { id: "EMP-002", name: "Michael Smith" },
  { id: "EMP-003", name: "Sarah Connor" },
  { id: "EMP-004", name: "Emily Chen" },
  { id: "EMP-005", name: "David Wilson" },
];

export default function DocumentsPage() {
  const folders = [
    { name: "Employee IDs", count: 142, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Tax Forms (KRA)", count: 135, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Certifications", count: 89, icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Background Checks", count: 142, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const initialDocs: EmployeeDoc[] = [];

  const [documents, setDocuments] = useState<EmployeeDoc[]>(initialDocs);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<EmployeeDoc | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "ID Document",
    ownerId: mockStaff[0].id,
  });

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const handleOpenModal = (doc?: EmployeeDoc) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        name: doc.name,
        type: doc.type,
        ownerId: doc.ownerId,
      });
    } else {
      setEditingDoc(null);
      setFormData({
        name: "",
        type: "ID Document",
        ownerId: mockStaff[0].id,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this document log?")) {
      setDocuments((docs) => docs.filter((d) => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = mockStaff.find((s) => s.id === formData.ownerId);
    const ownerName = staff ? staff.name : "Unknown Staff";

    if (editingDoc) {
      setDocuments((docs) =>
        docs.map((d) =>
          d.id === editingDoc.id
            ? {
                ...d,
                name: formData.name,
                type: formData.type,
                ownerId: formData.ownerId,
                ownerName,
              }
            : d
        )
      );
    } else {
      const newDoc: EmployeeDoc = {
        id: Date.now(),
        name: formData.name || "Untitled_Document.pdf",
        type: formData.type,
        ownerId: formData.ownerId,
        ownerName,
        size: (Math.random() * 5 + 0.1).toFixed(1) + " MB",
        date: "Just now",
      };
      setDocuments([newDoc, ...documents]);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 relative">
      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {folders.map((folder, index) => {
          const Icon = folder.icon;
          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-4 rounded-2xl ${folder.bg} ${folder.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <button className="text-slate-400 hover:text-primary-900 p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-black text-slate-800">{folder.name}</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">{folder.count} Files</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">Recent Uploads</h2>
            <p className="text-sm font-medium text-slate-500">Latest documents added to the repository</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400">
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">File Name</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Owner</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Size</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Date Modified</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No documents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group rounded-2xl">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          {doc.name.toLowerCase().endsWith(".pdf") ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{doc.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-700 text-sm">{doc.ownerName}</p>
                      <p className="text-xs text-slate-400">{doc.ownerId}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500 font-medium">{doc.size}</td>
                    <td className="py-4 px-4 text-sm text-slate-500 font-medium">{doc.date}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(doc)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Document Info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Document"
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
      </div>

      {/* Modal for Add/Edit Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingDoc ? "Edit Document Info" : "Upload New Document"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JDoe_Passport.pdf"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Document Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all text-sm bg-white"
                >
                  <option value="ID Document">ID Document</option>
                  <option value="Tax Form">Tax Form</option>
                  <option value="Certification">Certification</option>
                  <option value="Background Check">Background Check</option>
                  <option value="Contract">Contract</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Associated Staff Member</label>
                <select
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all text-sm bg-white"
                >
                  {mockStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors shadow-sm shadow-primary-900/20"
                >
                  {editingDoc ? "Save Changes" : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
