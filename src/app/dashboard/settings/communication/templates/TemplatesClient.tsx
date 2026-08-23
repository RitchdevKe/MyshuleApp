"use client";

import React, { useState, useTransition } from "react";
import {
  LayoutTemplate, Plus, Save, Mail, MessageSquare,
  Trash2, CheckCircle, Loader2, X, Tag,
} from "lucide-react";
import { createMessageTemplate, updateMessageTemplate, deleteMessageTemplate } from "@/app/actions/communicationSettings";
import { useRouter } from "next/navigation";

const VARIABLES = [
  "{{studentName}}", "{{parentName}}", "{{schoolName}}",
  "{{admissionNumber}}", "{{className}}", "{{invoiceAmount}}",
  "{{dueDate}}", "{{balance}}", "{{termName}}",
];

export default function TemplatesClient({ templates: initialTemplates }: { templates: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTemplate, setActiveTemplate] = useState<any>(initialTemplates[0] || null);
  const [toast, setToast] = useState<string | null>(null);

  // Local edits state
  const [edits, setEdits] = useState<Record<string, any>>({});

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newChannel, setNewChannel] = useState<"EMAIL" | "SMS">("EMAIL");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getEdit = (key: string) =>
    edits[activeTemplate?.id]?.[key] ?? activeTemplate?.[key] ?? "";

  const setEdit = (key: string, value: string) => {
    if (!activeTemplate) return;
    setEdits(prev => ({
      ...prev,
      [activeTemplate.id]: { ...prev[activeTemplate.id], [key]: value },
    }));
  };

  const insertVariable = (variable: string) => {
    const body = getEdit("body") as string;
    setEdit("body", body + variable);
  };

  const handleSave = () => {
    if (!activeTemplate) return;
    const patch = edits[activeTemplate.id] || {};
    startTransition(async () => {
      await updateMessageTemplate(activeTemplate.id, {
        subject: patch.subject ?? activeTemplate.subject,
        body: patch.body ?? activeTemplate.body,
        isActive: activeTemplate.isActive,
      });
      // Update local template representation
      setActiveTemplate({ ...activeTemplate, ...patch });
      router.refresh();
      showToast("Template saved!");
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createMessageTemplate({ name: newName.trim(), channel: newChannel });
      setShowCreate(false);
      setNewName("");
      router.refresh();
      showToast("Template created!");
    });
  };

  const handleDelete = () => {
    if (!activeTemplate) return;
    startTransition(async () => {
      await deleteMessageTemplate(activeTemplate.id);
      setActiveTemplate(initialTemplates.filter(t => t.id !== activeTemplate.id)[0] || null);
      router.refresh();
      showToast("Template deleted.");
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
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Message Templates</h3>
            <p className="text-sm font-medium text-slate-500">Design reusable Email and SMS message formats with merge variables.</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Template List */}
        <div className="lg:w-1/3 space-y-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">All Templates</h4>

          {initialTemplates.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <LayoutTemplate className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No templates yet.</p>
              <button onClick={() => setShowCreate(true)} className="mt-2 text-sm font-bold text-purple-600 hover:underline">Create one →</button>
            </div>
          )}

          {initialTemplates.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveTemplate(t)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeTemplate?.id === t.id ? "bg-purple-50 border-purple-200 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className={`font-bold text-sm truncate ${activeTemplate?.id === t.id ? "text-purple-900" : "text-slate-800"}`}>{t.name}</h5>
                  <p className={`text-xs font-medium truncate mt-0.5 ${activeTemplate?.id === t.id ? "text-purple-600" : "text-slate-400"}`}>
                    {t.subject || t.body?.substring(0, 40) + "..."}
                  </p>
                </div>
                <div className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${t.channel === "EMAIL" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {t.channel === "EMAIL" ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                  {t.channel}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editor Pane */}
        <div className="lg:w-2/3">
          {activeTemplate ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <h4 className="font-black text-slate-800">Editing: {activeTemplate.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${activeTemplate.channel === "EMAIL" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {activeTemplate.channel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {activeTemplate.channel === "EMAIL" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Subject Line</label>
                    <input
                      type="text"
                      value={getEdit("subject")}
                      onChange={e => setEdit("subject", e.target.value)}
                      placeholder="e.g. Your Invoice from {{schoolName}}"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {activeTemplate.channel === "EMAIL" ? "Email Body (HTML supported)" : "SMS Body"}
                  </label>
                  <textarea
                    value={getEdit("body")}
                    onChange={e => setEdit("body", e.target.value)}
                    rows={activeTemplate.channel === "EMAIL" ? 10 : 5}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all resize-y font-mono"
                    placeholder={activeTemplate.channel === "SMS"
                      ? "Dear {{parentName}}, {{studentName}} was absent today..."
                      : "<p>Dear {{parentName}},</p>\n<p>Your invoice of KES {{invoiceAmount}} is due on {{dueDate}}.</p>"}
                  />
                  {activeTemplate.channel === "SMS" && (
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {(getEdit("body") as string).length} / 160 characters
                      {(getEdit("body") as string).length > 160 && <span className="text-amber-600"> — will be sent as {Math.ceil((getEdit("body") as string).length / 153)} SMS parts</span>}
                    </p>
                  )}
                </div>

                {/* Variable chips */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Insert Variable</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {VARIABLES.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 px-2.5 py-1 rounded-lg font-mono transition-colors border border-transparent hover:border-purple-200"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50 gap-3">
              <LayoutTemplate className="w-10 h-10 text-slate-200" />
              <p className="text-sm font-bold">Select a template to edit it</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-800">New Message Template</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Invoice Reminder, Absence Alert"
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewChannel("EMAIL")}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${newChannel === "EMAIL" ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-bold">Email</span>
                  </button>
                  <button
                    onClick={() => setNewChannel("SMS")}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${newChannel === "SMS" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-bold">SMS</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={isPending || !newName.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
