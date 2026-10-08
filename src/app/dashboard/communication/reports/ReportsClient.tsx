"use client";

import React, { useState } from "react";
import { BarChart3, FileText, Zap, Search, Plus, Mail, MessageCircle, ArrowRight, AlertTriangle, Edit, Trash2, X } from "lucide-react";
import { MessageTemplate, CommunicationTrigger } from "@prisma/client";
import { createMessageTemplate, updateMessageTemplate, deleteMessageTemplate, createCommunicationTrigger, updateCommunicationTrigger, deleteCommunicationTrigger } from "./actions";

// We'll define a slightly augmented Trigger type to match what we return (includes template)
type Template = MessageTemplate;
type Trigger = CommunicationTrigger & { template?: MessageTemplate | null };

interface ReportsAutomationClientProps {
  initialTemplates: Template[];
  initialTriggers: Trigger[];
  analytics: { totalSent: number, totalSMS: number, deliveredSMS: number };
}

export default function ReportsAutomationClient({ initialTemplates, initialTriggers, analytics }: ReportsAutomationClientProps) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  
  // Form state
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);

  // Template Form
  const [templateForm, setTemplateForm] = useState({ name: "", channel: "EMAIL", subject: "", body: "", isActive: true });
  // Trigger Form
  const [triggerForm, setTriggerForm] = useState({ event: "", channel: "EMAIL", templateId: "", isActive: true });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTemplates = initialTemplates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTriggers = initialTriggers.filter(t => t.event.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handlers for Templates
  const handleOpenTemplateModal = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({ name: template.name, channel: template.channel, subject: template.subject || "", body: template.body, isActive: template.isActive });
    } else {
      setEditingTemplate(null);
      setTemplateForm({ name: "", channel: "EMAIL", subject: "", body: "", isActive: true });
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTemplate) {
        await updateMessageTemplate(editingTemplate.id, templateForm as any);
      } else {
        await createMessageTemplate(templateForm as any);
      }
      setIsTemplateModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteMessageTemplate(id);
      } catch (err) {
        console.error(err);
        alert("Error deleting template");
      }
    }
  };

  // Handlers for Triggers
  const handleOpenTriggerModal = (trigger?: Trigger) => {
    if (trigger) {
      setEditingTrigger(trigger);
      setTriggerForm({ event: trigger.event, channel: trigger.channel, templateId: trigger.templateId || "", isActive: trigger.isActive });
    } else {
      setEditingTrigger(null);
      setTriggerForm({ event: "", channel: "EMAIL", templateId: "", isActive: true });
    }
    setIsTriggerModalOpen(true);
  };

  const handleSaveTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTrigger) {
        await updateCommunicationTrigger(editingTrigger.id, triggerForm as any);
      } else {
        await createCommunicationTrigger({
          event: triggerForm.event,
          channel: triggerForm.channel as any,
          templateId: triggerForm.templateId || undefined
        });
      }
      setIsTriggerModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      try {
        await deleteCommunicationTrigger(id);
      } catch (err) {
        console.error(err);
        alert("Error deleting workflow");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        <button 
           onClick={() => { setActiveTab('analytics'); setSearchTerm(""); }}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <BarChart3 className="w-4 h-4" /> Analytics & Reports
        </button>
        <button 
           onClick={() => { setActiveTab('templates'); setSearchTerm(""); }}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'templates' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <FileText className="w-4 h-4" /> Message Templates
        </button>
        <button 
           onClick={() => { setActiveTab('automation'); setSearchTerm(""); }}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'automation' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <Zap className="w-4 h-4" /> Automated Workflows
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Header Actions */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           {activeTab === 'templates' && (
              <button onClick={() => handleOpenTemplateModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Create Template
              </button>
           )}
           {activeTab === 'automation' && (
              <button onClick={() => handleOpenTriggerModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Create Workflow
              </button>
           )}
        </div>

        {/* Dynamic Content */}
        <div className="p-6">
           {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Real Analytics Cards */}
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Messages Sent</p>
                    <h3 className="text-3xl font-black text-slate-800">{analytics.totalSent.toLocaleString()}</h3>
                    <p className="text-xs font-bold text-emerald-600 mt-2">All time</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">SMS Delivery Rate</p>
                    <h3 className="text-3xl font-black text-slate-800">
                      {analytics.totalSMS > 0 ? Math.round((analytics.deliveredSMS / analytics.totalSMS) * 100) : 0}%
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-2">
                      {analytics.deliveredSMS} / {analytics.totalSMS} SMS Delivered
                    </p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Templates</p>
                    <h3 className="text-3xl font-black text-slate-800">{initialTemplates.filter(t => t.isActive).length}</h3>
                    <p className="text-xs font-bold text-slate-500 mt-2">Ready for use</p>
                 </div>
              </div>
           )}

           {activeTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.length === 0 ? (
                     <div className="col-span-full py-10 text-center text-slate-500">
                        No templates found. Create one to get started.
                     </div>
                  ) : filteredTemplates.map((tpl: any) => (
                     <div key={tpl.id} className="border border-slate-200 p-5 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`p-2 rounded-lg ${tpl.channel === 'EMAIL' ? 'bg-blue-50 text-blue-600' : tpl.channel === 'SMS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {tpl.channel === 'EMAIL' ? <Mail className="w-5 h-5" /> : tpl.channel === 'SMS' ? <MessageCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                           </div>
                           <div className="flex items-center gap-2">
                             {!tpl.isActive && <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-1 rounded">INACTIVE</span>}
                             <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">{tpl.channel}</span>
                           </div>
                       </div>
                       <h4 className="font-bold text-slate-800 mb-1">{tpl.name}</h4>
                       <p className="text-sm text-slate-500 font-medium line-clamp-2">{tpl.subject || "No Subject"}</p>
                       <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tpl.body}</p>

                       <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleOpenTemplateModal(tpl)} className="p-1.5 bg-white text-slate-500 hover:text-primary-600 rounded-md shadow-sm border border-slate-200">
                           <Edit className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDeleteTemplate(tpl.id)} className="p-1.5 bg-white text-slate-500 hover:text-rose-600 rounded-md shadow-sm border border-slate-200">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  ))}
              </div>
           )}

           {activeTab === 'automation' && (
              <div className="space-y-4">
                  {filteredTriggers.length === 0 ? (
                     <div className="py-10 text-center text-slate-500">
                        No automated workflows found. Create one to get started.
                     </div>
                  ) : filteredTriggers.map((workflow: any) => (
                    <div key={workflow.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors gap-4">
                       <div>
                          <h4 className="font-bold text-slate-800">{workflow.event}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                             <span>Channel: {workflow.channel}</span>
                             {workflow.template && (
                                <>
                                  <span>•</span>
                                  <span>Template: {workflow.template.name}</span>
                                </>
                             )}
                          </div>
                       </div>
                       <div className="flex items-center gap-4 self-end sm:self-auto">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${workflow.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                             {workflow.isActive ? "Active" : "Paused"}
                          </span>
                          <button onClick={() => handleOpenTriggerModal(workflow)} className="flex items-center gap-1 p-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm shadow-sm">
                             <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTrigger(workflow.id)} className="flex items-center gap-1 p-2 bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-sm shadow-sm">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
              </div>
           )}
        </div>
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{editingTemplate ? "Edit Template" : "Create Template"}</h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="template-form" onSubmit={handleSaveTemplate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                  <input 
                    required type="text" 
                    value={templateForm.name} 
                    onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    placeholder="e.g. Welcome Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Channel</label>
                  <select 
                    value={templateForm.channel} 
                    onChange={e => setTemplateForm({...templateForm, channel: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject (for Email)</label>
                  <input 
                    type="text" 
                    value={templateForm.subject} 
                    onChange={e => setTemplateForm({...templateForm, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Body</label>
                  <textarea 
                    required 
                    rows={4}
                    value={templateForm.body} 
                    onChange={e => setTemplateForm({...templateForm, body: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="template-active" 
                    checked={templateForm.isActive} 
                    onChange={e => setTemplateForm({...templateForm, isActive: e.target.checked})}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <label htmlFor="template-active" className="text-sm font-medium text-slate-700">Active</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsTemplateModalOpen(false)} 
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                form="template-form" 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Modal */}
      {isTriggerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{editingTrigger ? "Edit Workflow" : "Create Workflow"}</h3>
              <button onClick={() => setIsTriggerModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="trigger-form" onSubmit={handleSaveTrigger} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Event Trigger</label>
                  <input 
                    required type="text" 
                    value={triggerForm.event} 
                    onChange={e => setTriggerForm({...triggerForm, event: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    placeholder="e.g. On Enrollment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Channel</label>
                  <select 
                    value={triggerForm.channel} 
                    onChange={e => setTriggerForm({...triggerForm, channel: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Message Template</label>
                  <select 
                    value={triggerForm.templateId} 
                    onChange={e => setTriggerForm({...triggerForm, templateId: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">-- Select Template --</option>
                    {initialTemplates.filter(t => t.isActive).map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.channel})</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Optional. Select a template to automatically send on this event.</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="trigger-active" 
                    checked={triggerForm.isActive} 
                    onChange={e => setTriggerForm({...triggerForm, isActive: e.target.checked})}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <label htmlFor="trigger-active" className="text-sm font-medium text-slate-700">Active (Workflow is enabled)</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsTriggerModalOpen(false)} 
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                form="trigger-form" 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Workflow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
