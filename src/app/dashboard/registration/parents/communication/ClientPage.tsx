"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Mail, Smartphone, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, Send, Clock, Sparkles, X, Edit, Trash2 } from "lucide-react";
import { createMessageTemplate, updateMessageTemplate, deleteMessageTemplate, sendCommunication } from "@/app/actions/communicationLogs";

const typeConfig: Record<string, { bg: string, text: string, border: string, icon: React.ElementType }> = {
  "SMS":   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: Smartphone },
  "EMAIL": { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: Mail },
  "PUSH_NOTIFICATION":   { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  icon: MessageSquare },
};

export default function ClientPage({ logs, templates, recipients }: { logs: any[], templates: any[], recipients: any }) {
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState<string>("ALL");
  
  // Modals state
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  
  // Template state
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateForm, setTemplateForm] = useState({ name: "", channel: "EMAIL", subject: "", body: "" });

  // Compose state
  const [composeForm, setComposeForm] = useState({ recipientId: "", channel: "EMAIL", subject: "", body: "" });

  const getRecipientName = (row: any) => {
    if (row.recipientUser) {
      if (row.recipientUser.parents?.length > 0) return `${row.recipientUser.parents[0].firstName} ${row.recipientUser.parents[0].lastName}`;
      if (row.recipientUser.students?.length > 0) return `${row.recipientUser.students[0].firstName} ${row.recipientUser.students[0].lastName}`;
      if (row.recipientUser.staff?.length > 0) return `${row.recipientUser.staff[0].firstName} ${row.recipientUser.staff[0].lastName}`;
      return row.recipientUser.email || row.contactAddress;
    }
    return row.contactAddress;
  };

  const filteredLogs = logs.filter(m => {
    const recipientName = getRecipientName(m);
    const matchesSearch = recipientName.toLowerCase().includes(search.toLowerCase()) || 
                          (m.subject && m.subject.toLowerCase().includes(search.toLowerCase())) ||
                          m.body.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = filterChannel === "ALL" || m.channel === filterChannel;
    return matchesSearch && matchesChannel;
  });

  const handleSaveTemplate = async () => {
    if (editingTemplate) {
      await updateMessageTemplate(editingTemplate.id, templateForm as any);
    } else {
      await createMessageTemplate(templateForm as any);
    }
    setEditingTemplate(null);
    setTemplateForm({ name: "", channel: "EMAIL", subject: "", body: "" });
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteMessageTemplate(id);
    }
  };

  const handleSend = async () => {
    // Find contact address based on recipientId
    let contactAddress = "";
    let recipientUserId = undefined;

    const allRecipients = [...recipients.parents, ...recipients.admissions];
    const rec = allRecipients.find(r => r.id === composeForm.recipientId);
    if (rec) {
      contactAddress = composeForm.channel === "EMAIL" ? rec.email : rec.phone;
      recipientUserId = rec.userId || undefined;
    }

    if (!contactAddress) {
      alert("Selected recipient does not have valid contact info for this channel.");
      return;
    }

    await sendCommunication({
      recipientUserId,
      contactAddress,
      channel: composeForm.channel as any,
      subject: composeForm.subject,
      body: composeForm.body
    });
    
    setShowComposeModal(false);
    setComposeForm({ recipientId: "", channel: "EMAIL", subject: "", body: "" });
  };

  const kpis = [
    { label: "Messages Sent",   value: logs.length, icon: Send, color: "from-primary-600 to-primary-800" },
    { label: "Delivery Rate",   value: logs.length ? Math.round((logs.filter(l => l.status === "DELIVERED").length / logs.length) * 100) + "%" : "0%", icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
    { label: "Failed",          value: logs.filter(l => l.status === "FAILED").length, icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "Email Campaigns", value: logs.filter(l => l.channel === "EMAIL").length, icon: Mail, color: "from-blue-500 to-indigo-600" },
  ];

  return (
    <div className="space-y-4 relative">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipients or content..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowTemplatesModal(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <MessageSquare className="w-4 h-4" /> Templates
            </button>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="ALL">All Channels</option>
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="PUSH_NOTIFICATION">App Push</option>
            </select>
            <button onClick={() => setShowComposeModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> New Message
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Recipient</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Message Summary</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((row) => {
                const typeCfg = typeConfig[row.channel] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: Mail };
                const Icon = typeCfg.icon;
                const recipientName = getRecipientName(row);
                const dateStr = new Date(row.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const shortId = row.id.substring(0, 8).toUpperCase();

                return (
                  <tr key={row.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{dateStr}</div>
                      <div className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">{shortId}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">{recipientName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                        <Icon className="w-3 h-3" /> {row.channel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-medium max-w-xs truncate">
                      {row.subject ? <strong>{row.subject}: </strong> : null}
                      {row.body}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        row.status === 'SENT' || row.status === 'DELIVERED' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : row.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-bold text-lg text-slate-500">No messages found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 mt-auto">
          <span className="font-bold">Showing <span className="text-primary-900">{filteredLogs.length}</span> messages</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold disabled:opacity-40" disabled>
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-900 text-white text-xs font-black">1</button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Message Templates</h2>
              <button onClick={() => setShowTemplatesModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex gap-6">
              {/* Template List */}
              <div className="w-1/2 space-y-3 border-r border-slate-100 pr-4">
                <h3 className="font-bold text-sm text-slate-500 mb-2">Existing Templates</h3>
                {templates.map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-300 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                        <p className="text-[10px] font-black text-primary-600 uppercase mt-1">{t.channel}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        <button onClick={() => {
                          setEditingTemplate(t);
                          setTemplateForm({ name: t.name, channel: t.channel, subject: t.subject || "", body: t.body });
                        }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTemplate(t.id)} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {templates.length === 0 && <p className="text-sm text-slate-500">No templates found.</p>}
              </div>

              {/* Template Form */}
              <div className="w-1/2 space-y-4">
                <h3 className="font-bold text-sm text-slate-500 mb-2">{editingTemplate ? "Edit Template" : "New Template"}</h3>
                <input
                  type="text" placeholder="Template Name"
                  value={templateForm.name} onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                />
                <select 
                  value={templateForm.channel} onChange={e => setTemplateForm({...templateForm, channel: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                >
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH_NOTIFICATION">App Push</option>
                </select>
                {templateForm.channel === "EMAIL" && (
                  <input
                    type="text" placeholder="Email Subject"
                    value={templateForm.subject} onChange={e => setTemplateForm({...templateForm, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                  />
                )}
                <textarea
                  placeholder="Message Body..." rows={4}
                  value={templateForm.body} onChange={e => setTemplateForm({...templateForm, body: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  {editingTemplate && (
                    <button onClick={() => { setEditingTemplate(null); setTemplateForm({ name: "", channel: "EMAIL", subject: "", body: "" }); }} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
                  )}
                  <button onClick={handleSaveTemplate} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md">
                    {editingTemplate ? "Update Template" : "Create Template"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Compose Message</h2>
              <button onClick={() => setShowComposeModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Recipient</label>
                <select 
                  value={composeForm.recipientId} onChange={e => setComposeForm({...composeForm, recipientId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">Select recipient...</option>
                  <optgroup label="Parents">
                    {recipients.parents.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Admissions">
                    {recipients.admissions.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Channel</label>
                <select 
                  value={composeForm.channel} onChange={e => {
                    setComposeForm({...composeForm, channel: e.target.value});
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                >
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH_NOTIFICATION">App Push</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Or use a template:</span>
                <select 
                  onChange={e => {
                    const t = templates.find(t => t.id === e.target.value);
                    if (t) setComposeForm({...composeForm, subject: t.subject || "", body: t.body, channel: t.channel});
                  }}
                  className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">Select template...</option>
                  {templates.filter(t => t.channel === composeForm.channel).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {composeForm.channel === "EMAIL" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                  <input
                    type="text" placeholder="Subject..."
                    value={composeForm.subject} onChange={e => setComposeForm({...composeForm, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Message Body</label>
                <textarea
                  placeholder="Type your message..." rows={5}
                  value={composeForm.body} onChange={e => setComposeForm({...composeForm, body: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowComposeModal(false)} className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
                <button onClick={handleSend} disabled={!composeForm.recipientId || !composeForm.body} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md disabled:opacity-50">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}