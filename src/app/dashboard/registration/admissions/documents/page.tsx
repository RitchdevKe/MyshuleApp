'use client';

import React, { useState, useEffect } from "react";
import {
  Search, Plus, MoreHorizontal, CheckCircle2, Clock,
  XCircle, Eye, Download, Upload, FileText, FileBadge,
  FileCheck, ChevronLeft, ChevronRight, AlertTriangle, Trash2
} from "lucide-react";
import { getStudentDocuments, uploadStudentDocument, deleteStudentDocument } from "@/app/actions/documents";
import { getStudentsDirectory } from "@/app/actions/students";

const DOC_ICONS: Record<string, React.ElementType> = {
  "Birth Certificate":    FileBadge,
  "KCPE Results Slip":   FileCheck,
  "Medical Certificate":  FileText,
  "Parent ID (Copy)":    FileText,
  "Transfer Certificate": FileCheck,
  "Immunization Card":   FileBadge,
  "NHIF Card (Parent)":  FileText,
  "School Leaving Cert": FileCheck,
};

const DOC_TYPES = [
  "Birth Certificate", "KCPE Results Slip", "Medical Certificate",
  "Parent ID (Copy)", "Transfer Certificate", "Immunization Card",
  "NHIF Card (Parent)", "School Leaving Cert", "Other"
];

const FILTERS = ["All", "Verified", "Pending", "Rejected"];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [docsData, setDocsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [uploadForm, setUploadForm] = useState({ studentId: "", documentType: "Birth Certificate", fileUrl: "" });
  const [uploading, setUploading] = useState(false);

  const [viewDoc, setViewDoc] = useState<string | null>(null);

  // We mock statuses in local state since DB doesn't have it
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDocs();
    getStudentsDirectory().then(res => {
      if (res.success) {
        setStudents(res.data);
      }
    });
  }, []);

  const fetchDocs = () => {
    setLoading(true);
    getStudentDocuments().then(res => {
      if (res.success) {
        const mapped = res.data.map((d: any) => {
          return {
            id: d.id,
            student: `${d.student?.firstName} ${d.student?.lastName}`,
            adm: d.student?.admissionNumber,
            docType: d.documentType,
            uploaded: new Date(d.uploadedAt).toLocaleDateString(),
            verifiedBy: "Admin",
            status: "Verified",
            size: "1.0 MB",
            initials: `${d.student?.firstName?.[0] || ""}${d.student?.lastName?.[0] || ""}`.toUpperCase(),
            fileUrl: d.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          };
        });
        setDocsData(mapped);
      }
      setLoading(false);
    });
  };

  const handleUpload = async () => {
    if (!uploadForm.studentId || !uploadForm.fileUrl) {
      alert("Please select a student and provide a file URL.");
      return;
    }
    setUploading(true);
    const res = await uploadStudentDocument(uploadForm);
    if (res.success) {
      setIsUploadModalOpen(false);
      setUploadForm({ studentId: "", documentType: "Birth Certificate", fileUrl: "" });
      fetchDocs();
    } else {
      alert("Failed to upload document.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const res = await deleteStudentDocument(id);
      if (res.success) {
        setDocsData(docsData.filter(d => d.id !== id));
      } else {
        alert("Failed to delete document.");
      }
    }
  };

  const changeStatus = (id: string, newStatus: string) => {
    setStatusMap(prev => ({ ...prev, [id]: newStatus }));
  };

  const getDocStatus = (doc: any) => {
    return statusMap[doc.id] || doc.status;
  };

  const filtered = docsData.filter(d => {
    const matchSearch = !search || d.student.toLowerCase().includes(search.toLowerCase()) || d.docType.toLowerCase().includes(search.toLowerCase());
    const currentStatus = getDocStatus(d);
    const matchFilter = filter === "All" || currentStatus === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    Verified: docsData.filter(d => getDocStatus(d) === "Verified").length,
    Pending:  docsData.filter(d => getDocStatus(d) === "Pending").length,
    Rejected: docsData.filter(d => getDocStatus(d) === "Rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Verified Documents", value: counts.Verified, icon: CheckCircle2, color: "from-emerald-600 to-teal-600" },
          { label: "Pending Verification", value: counts.Pending, icon: AlertTriangle, color: "from-amber-500 to-orange-500" },
          { label: "Rejected / Resubmit", value: counts.Rejected, icon: XCircle, color: "from-rose-600 to-red-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-black mt-0.5 leading-none">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-white/80 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student or document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-72 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {FILTERS.map(f => <option key={f} value={f}>{f === "All" ? "All Status" : f}</option>)}
            </select>
            <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-black rounded-xl shadow-md transition-all">
              <Upload className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploaded</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(d => {
                  const DocIcon = DOC_ICONS[d.docType] || FileText;
                  const currentStatus = getDocStatus(d);
                  let statusPill = "bg-slate-100 text-slate-700 border-slate-200";
                  let StatusIcon = Clock;
                  if (currentStatus === "Verified") {
                    statusPill = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    StatusIcon = CheckCircle2;
                  } else if (currentStatus === "Rejected") {
                    statusPill = "bg-rose-50 text-rose-700 border-rose-200";
                    StatusIcon = XCircle;
                  } else if (currentStatus === "Pending") {
                    statusPill = "bg-amber-50 text-amber-700 border-amber-200";
                    StatusIcon = AlertTriangle;
                  }

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                            <DocIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 leading-tight">{d.docType}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{d.size} &bull; PDF</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 flex-shrink-0">
                            {d.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700">{d.student}</p>
                            <p className="text-[10px] font-bold text-slate-400">{d.adm}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-bold text-slate-600">{d.uploaded}</p>
                        <p className="text-[10px] font-medium text-slate-400">by Admin</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <select 
                            value={currentStatus} 
                            onChange={(e) => changeStatus(d.id, e.target.value)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide cursor-pointer focus:outline-none appearance-none ${statusPill}`}
                          >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          {d.verifiedBy !== "—" && currentStatus === "Verified" && (
                            <span className="text-[9px] font-bold text-slate-400 ml-1">
                              by {d.verifiedBy}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewDoc(d.fileUrl)} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" title="View Document">
                            <Eye className="w-4 h-4" />
                          </button>
                          <a href={d.fileUrl} download target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors inline-block" title="Download">
                            <Download className="w-4 h-4" />
                          </a>
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm font-bold">
                      No documents found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student</label>
                <select 
                  value={uploadForm.studentId}
                  onChange={e => setUploadForm({...uploadForm, studentId: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Document Type</label>
                <select 
                  value={uploadForm.documentType}
                  onChange={e => setUploadForm({...uploadForm, documentType: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">File URL</label>
                <input 
                  type="text" 
                  value={uploadForm.fileUrl}
                  onChange={e => setUploadForm({...uploadForm, fileUrl: e.target.value})}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" /> Document Viewer
              </h3>
              <button onClick={() => setViewDoc(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 p-0 bg-slate-200">
              <iframe src={viewDoc} className="w-full h-full border-0" title="Document Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
