"use client";

import React, { useState, useTransition } from "react";
import {
  Mail, MessageSquare, Save, Settings2, Key, Server, User,
  CheckCircle, Loader2, Eye, EyeOff, ChevronDown, ChevronUp,
} from "lucide-react";
import { updateCommunicationSettings } from "@/app/actions/communicationSettings";
import { useRouter } from "next/navigation";

export default function ChannelsClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [emailOpen, setEmailOpen] = useState(true);
  const [smsOpen, setSmsOpen] = useState(true);

  const [formData, setFormData] = useState({
    emailProvider: settings.emailProvider || "SMTP",
    smtpHost: settings.smtpHost || "",
    smtpPort: settings.smtpPort ? String(settings.smtpPort) : "",
    smtpUser: settings.smtpUser || "",
    smtpPassword: settings.smtpPassword || "",
    smsProvider: settings.smsProvider || "AFRICASTALKING",
    smsApiKey: settings.smsApiKey || "",
    smsSenderId: settings.smsSenderId || "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateCommunicationSettings({
        ...formData,
        smtpPort: parseInt(formData.smtpPort) || null,
      });
      router.refresh();
      showToast("Communication channels saved!");
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Communication Channels</h3>
            <p className="text-sm font-medium text-slate-500">Configure your Email (SMTP / API) and SMS gateway providers.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </button>
      </div>

      <div className="space-y-6">

        {/* ── Email Card ── */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <button
            onClick={() => setEmailOpen(o => !o)}
            className="w-full flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-black text-slate-800">Email Gateway</h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {formData.emailProvider === "SMTP" ? `SMTP · ${formData.smtpHost || "not configured"}` : formData.emailProvider}
                </p>
              </div>
            </div>
            {emailOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {emailOpen && (
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
                <select
                  name="emailProvider"
                  value={formData.emailProvider}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="SMTP">Custom SMTP Server</option>
                  <option value="SENDGRID">SendGrid</option>
                  <option value="AWS_SES">Amazon SES</option>
                  <option value="MAILGUN">Mailgun</option>
                </select>
              </div>

              {formData.emailProvider === "SMTP" && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">SMTP Host</label>
                      <div className="relative">
                        <Server className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          name="smtpHost"
                          value={formData.smtpHost}
                          onChange={handleChange}
                          placeholder="smtp.gmail.com"
                          className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Port</label>
                      <input
                        type="number"
                        name="smtpPort"
                        value={formData.smtpPort}
                        onChange={handleChange}
                        placeholder="587"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Username / Email</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        name="smtpUser"
                        value={formData.smtpUser}
                        onChange={handleChange}
                        placeholder="no-reply@yourschool.com"
                        className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">App Password / SMTP Password</label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showSmtpPassword ? "text" : "password"}
                        name="smtpPassword"
                        value={formData.smtpPassword}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPassword(v => !v)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {formData.emailProvider !== "SMTP" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showSmtpPassword ? "text" : "password"}
                      name="smtpPassword"
                      value={formData.smtpPassword}
                      onChange={handleChange}
                      placeholder="Paste your API key here"
                      className="w-full pl-9 pr-10 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <button type="button" onClick={() => setShowSmtpPassword(v => !v)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">You can find this in your {formData.emailProvider} dashboard.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── SMS Card ── */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <button
            onClick={() => setSmsOpen(o => !o)}
            className="w-full flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-black text-slate-800">SMS Gateway</h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {formData.smsProvider} · Sender: {formData.smsSenderId || "not configured"}
                </p>
              </div>
            </div>
            {smsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {smsOpen && (
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
                <select
                  name="smsProvider"
                  value={formData.smsProvider}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="AFRICASTALKING">Africa's Talking</option>
                  <option value="TWILIO">Twilio</option>
                  <option value="MSG91">MSG91</option>
                  <option value="INFOBIP">Infobip</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">API Key / Auth Token</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showApiKey ? "text" : "password"}
                    name="smsApiKey"
                    value={formData.smsApiKey}
                    onChange={handleChange}
                    placeholder="Paste your API key"
                    className="w-full pl-9 pr-10 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowApiKey(v => !v)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sender ID (Alphanumeric)</label>
                <input
                  type="text"
                  name="smsSenderId"
                  value={formData.smsSenderId}
                  onChange={handleChange}
                  placeholder="e.g. MYSHULE"
                  maxLength={11}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase"
                />
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  Max 11 characters. Must be registered and approved by your SMS provider.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
