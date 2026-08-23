"use client";

import React, { useState, useTransition } from "react";
import { Zap, Mail, MessageSquare, CheckCircle, Loader2, Info } from "lucide-react";
import { toggleCommunicationTrigger, assignTemplateToTrigger } from "@/app/actions/communicationSettings";
import { useRouter } from "next/navigation";

const EVENT_DESCRIPTIONS: Record<string, string> = {
  INVOICE_GENERATED: "Sent when a new fee invoice is generated for a student.",
  STUDENT_ABSENT: "Sent when a student is marked absent in the attendance register.",
  EXAM_PUBLISHED: "Sent when exam results are published for students/parents to view.",
  NEW_ADMISSION: "Sent when a new student admission application is approved.",
  PAYMENT_RECEIVED: "Sent when a fee payment is recorded against an invoice.",
  FEE_OVERDUE: "Sent when an invoice passes its due date without full payment.",
};

export default function TriggersClient({ triggers: initialTriggers, templates }: { triggers: any[]; templates: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  // Local optimistic state
  const [localTriggers, setLocalTriggers] = useState(initialTriggers);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (id: string, currentIsActive: boolean) => {
    // Optimistic update
    setLocalTriggers(prev =>
      prev.map(t => t.id === id ? { ...t, isActive: !currentIsActive } : t)
    );
    startTransition(async () => {
      await toggleCommunicationTrigger(id, !currentIsActive);
      router.refresh();
      showToast(!currentIsActive ? "Trigger activated!" : "Trigger deactivated.");
    });
  };

  const handleTemplateChange = (triggerId: string, templateId: string) => {
    // Optimistic update
    const tpl = templates.find(t => t.id === templateId) || null;
    setLocalTriggers(prev =>
      prev.map(t => t.id === triggerId ? { ...t, templateId: templateId || null, template: tpl } : t)
    );
    startTransition(async () => {
      await assignTemplateToTrigger(triggerId, templateId || null);
      router.refresh();
    });
  };

  // Group by event
  const grouped = localTriggers.reduce((acc: Record<string, any[]>, t: any) => {
    if (!acc[t.event]) acc[t.event] = [];
    acc[t.event].push(t);
    return acc;
  }, {});

  const formatEvent = (str: string) =>
    str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const activeCount = localTriggers.filter(t => t.isActive).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Automated Triggers</h3>
            <p className="text-sm font-medium text-slate-500">Map school events to message templates for automatic delivery.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold">
          <Zap className="w-4 h-4" />
          {activeCount} active trigger{activeCount !== 1 ? "s" : ""}
        </div>
      </div>

      {templates.length === 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">No message templates found.</p>
            <p className="text-xs font-medium text-amber-700 mt-0.5">
              Go to the <strong>Templates</strong> tab to create Email and SMS templates first, then come back here to assign them to triggers.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {Object.keys(grouped).map(eventName => (
          <div key={eventName} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
              <h4 className="font-black text-slate-800">{formatEvent(eventName)}</h4>
              {EVENT_DESCRIPTIONS[eventName] && (
                <p className="text-xs font-medium text-slate-400 mt-0.5">{EVENT_DESCRIPTIONS[eventName]}</p>
              )}
            </div>
            <div className="divide-y divide-slate-100">
              {grouped[eventName].map((t: any) => {
                const channelTemplates = templates.filter(tpl => tpl.channel === t.channel);
                const hasTemplate = !!t.templateId;
                return (
                  <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.channel === "EMAIL" ? "bg-indigo-50 text-indigo-500" : "bg-emerald-50 text-emerald-500"}`}>
                        {t.channel === "EMAIL" ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          Send {t.channel === "EMAIL" ? "Email" : "SMS"}
                        </div>
                        {t.template && (
                          <div className="text-xs font-medium text-slate-400 mt-0.5">
                            Template: {t.template.name}
                          </div>
                        )}
                        {!hasTemplate && (
                          <div className="text-xs font-medium text-amber-500 mt-0.5">
                            No template assigned — cannot be activated
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Template picker */}
                      <select
                        value={t.templateId || ""}
                        onChange={e => handleTemplateChange(t.id, e.target.value)}
                        disabled={isPending}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-all min-w-[160px]"
                      >
                        <option value="">— No Template —</option>
                        {channelTemplates.map(tpl => (
                          <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                        ))}
                      </select>

                      {/* Toggle */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${t.isActive ? "text-green-600" : "text-slate-400"}`}>
                          {t.isActive ? "ON" : "OFF"}
                        </span>
                        <button
                          onClick={() => handleToggle(t.id, t.isActive)}
                          disabled={isPending || !hasTemplate}
                          title={!hasTemplate ? "Assign a template first" : t.isActive ? "Deactivate" : "Activate"}
                          className={`w-12 h-6 rounded-full relative transition-colors disabled:opacity-30 ${t.isActive ? "bg-yellow-500" : "bg-slate-300"}`}
                        >
                          {isPending && <Loader2 className="w-3 h-3 animate-spin absolute inset-0 m-auto text-white" />}
                          {!isPending && (
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${t.isActive ? "left-7" : "left-1"}`} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No triggers configured.</p>
          </div>
        )}
      </div>
    </div>
  );
}
