"use client";

import React, { useState, useTransition } from "react";
import { FileText, Plus, X, LayoutTemplate, MessageSquare, Award, CheckSquare, Target, Save, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { createDocumentTemplate, updateDocumentTemplate } from "@/app/actions/documentTemplates";
import { deleteDocumentTemplate, setDefaultDocumentTemplate } from "@/app/actions/academic_docs";
import { useRouter } from "next/navigation";

export default function DocumentsClient({ templates: initialTemplates }: { templates: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTemplate, setActiveTemplate] = useState<any>(initialTemplates[0] || null);
  const [toast, setToast] = useState<string | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"REPORT_CARD" | "TRANSCRIPT" | "LEAVING_CERTIFICATE">("REPORT_CARD");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: string) => {
    if (!activeTemplate) return;
    setActiveTemplate({ ...activeTemplate, [key]: !activeTemplate[key] });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeTemplate) return;
    setActiveTemplate({ ...activeTemplate, footerText: e.target.value });
  };

  const handleSave = () => {
    if (!activeTemplate) return;
    startTransition(async () => {
      await updateDocumentTemplate(activeTemplate.id, {
        showClassTeacherRemarks: activeTemplate.showClassTeacherRemarks,
        showPrincipalRemarks: activeTemplate.showPrincipalRemarks,
        showAttendance: activeTemplate.showAttendance,
        showBehavior: activeTemplate.showBehavior,
        footerText: activeTemplate.footerText,
      });
      router.refresh();
      showToast("Template saved successfully!");
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createDocumentTemplate({ name: newName.trim(), type: newType });
      setShowCreateModal(false);
      setNewName("");
      router.refresh();
      showToast("Template created!");
    });
  };

  const handleDelete = () => {
    if (!activeTemplate) return;
    if (confirm("Are you sure you want to delete this template?")) {
      startTransition(async () => {
        await deleteDocumentTemplate(activeTemplate.id);
        setActiveTemplate(null);
        router.refresh();
        showToast("Template deleted.");
      });
    }
  };

  const handleSetDefault = () => {
    if (!activeTemplate) return;
    startTransition(async () => {
      await setDefaultDocumentTemplate(activeTemplate.id, activeTemplate.type);
      setActiveTemplate({ ...activeTemplate, isDefault: true });
      router.refresh();
      showToast("Template set as default.");
    });
  };

  return (
    <div className="p-6 md:p-8">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Document Templates</h3>
            <p className="text-sm font-medium text-slate-500">Configure report cards, transcripts, and leaving certificates.</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Template List */}
        <div className="lg:w-1/3 space-y-3">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Templates</h4>

          {initialTemplates.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No templates yet.</p>
              <button onClick={() => setShowCreateModal(true)} className="mt-3 text-sm font-bold text-pink-600 hover:underline">Create one →</button>
            </div>
          )}

          {initialTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => setActiveTemplate(template)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeTemplate?.id === template.id ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className={`font-bold text-sm ${activeTemplate?.id === template.id ? 'text-pink-900' : 'text-slate-800'}`}>{template.name}</h5>
                {template.isDefault && <span className="bg-pink-200 text-pink-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Default</span>}
              </div>
              <p className={`text-xs font-medium ${activeTemplate?.id === template.id ? 'text-pink-700' : 'text-slate-500'}`}>
                {template.type.replace(/_/g, " ")}
              </p>
            </div>
          ))}
        </div>

        {/* Configuration Pane */}
        <div className="lg:w-2/3">
          {activeTemplate ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <LayoutTemplate className="w-5 h-5 text-slate-400" />
                  <h4 className="font-black text-slate-800 text-lg">Editing: {activeTemplate.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {!activeTemplate.isDefault && (
                    <button
                      onClick={handleSetDefault}
                      disabled={isPending}
                      className="px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 ml-2"
                  >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 mb-3">Included Sections</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "showClassTeacherRemarks", icon: MessageSquare, label: "Class Teacher Remarks" },
                      { key: "showPrincipalRemarks", icon: Target, label: "Principal Remarks" },
                      { key: "showAttendance", icon: CheckSquare, label: "Attendance Summary" },
                      { key: "showBehavior", icon: Award, label: "Behavior & Conduct" },
                    ].map(({ key, icon: Icon, label }) => (
                      <label key={key} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${activeTemplate[key] ? 'bg-pink-50/50 border-pink-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${activeTemplate[key] ? 'text-pink-500' : 'text-slate-400'}`} />
                          <span className="text-sm font-bold text-slate-700">{label}</span>
                        </div>
                        <input type="checkbox" checked={activeTemplate[key]} onChange={() => handleToggle(key)} className="rounded text-pink-500 focus:ring-pink-500" />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-slate-800 mb-3">Footer Text (Disclaimer)</h5>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none h-24"
                    value={activeTemplate.footerText || ""}
                    onChange={handleTextChange}
                    placeholder="e.g. This document is generated electronically and is valid without a signature."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              Select a template from the list to edit it.
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-800">New Document Template</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Template Name</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Term 1 Report Card"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-pink-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Document Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-pink-500 focus:bg-white transition-all">
                  <option value="REPORT_CARD">Report Card</option>
                  <option value="TRANSCRIPT">Transcript</option>
                  <option value="LEAVING_CERTIFICATE">Leaving Certificate</option>
                </select>
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={isPending || !newName.trim()}
                className="px-5 py-2 text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl disabled:opacity-50 flex items-center gap-2 transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
