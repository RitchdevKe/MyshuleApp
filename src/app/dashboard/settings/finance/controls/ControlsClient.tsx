"use client";

import React, { useState, useTransition } from "react";
import { ShieldAlert, Save, CheckCircle, Loader2 } from "lucide-react";
import { updateFinanceSettings } from "@/app/actions/financeSettings";
import { useRouter } from "next/navigation";

export default function ControlsClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    invoicePrefix: settings.invoicePrefix ?? "INV",
    receiptPrefix: settings.receiptPrefix ?? "RCP",
    allowPartialPayments: settings.allowPartialPayments ?? false,
    requireDiscountApproval: settings.requireDiscountApproval ?? true,
    // Store as string so field starts empty if 0 — avoid stuck 0
    taxRate: settings.taxRate != null ? String(settings.taxRate) : "",
    defaultCurrency: settings.defaultCurrency ?? "KES",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (key: "allowPartialPayments" | "requireDiscountApproval") => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateFinanceSettings({
        invoicePrefix: formData.invoicePrefix,
        receiptPrefix: formData.receiptPrefix,
        allowPartialPayments: formData.allowPartialPayments,
        requireDiscountApproval: formData.requireDiscountApproval,
        taxRate: parseFloat(formData.taxRate) || 0,
        defaultCurrency: formData.defaultCurrency,
      });
      router.refresh();
      showToast("Financial controls saved!");
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
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Financial Controls</h3>
            <p className="text-sm font-medium text-slate-500">Global policies, numbering rules, and currency settings.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Controls
        </button>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* Document Numbering */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800">Document Numbering</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Prefixes used in auto-generated document numbers.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                name="invoicePrefix"
                value={formData.invoicePrefix}
                onChange={handleText}
                placeholder="e.g. INV"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <p className="text-xs text-slate-400 font-medium mt-1">Documents will be numbered like: {formData.invoicePrefix || "INV"}-00001</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Receipt Prefix</label>
              <input
                type="text"
                name="receiptPrefix"
                value={formData.receiptPrefix}
                onChange={handleText}
                placeholder="e.g. RCP"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <p className="text-xs text-slate-400 font-medium mt-1">Documents will be numbered like: {formData.receiptPrefix || "RCP"}-00001</p>
            </div>
          </div>
        </section>

        {/* Payment Rules */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800">Payment Rules</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Configure how payments and discounts are handled system-wide.</p>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-slate-800 text-sm">Allow Partial Payments</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Parents can pay invoices in installments rather than the full amount at once.</div>
              </div>
              <button
                onClick={() => handleToggle("allowPartialPayments")}
                className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ml-6 ${formData.allowPartialPayments ? "bg-blue-500" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData.allowPartialPayments ? "left-7" : "left-1"}`}></div>
              </button>
            </div>
            <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-slate-800 text-sm">Require Approval for Discounts</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Bursars must request admin approval before applying any discount on an invoice.</div>
              </div>
              <button
                onClick={() => handleToggle("requireDiscountApproval")}
                className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ml-6 ${formData.requireDiscountApproval ? "bg-blue-500" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData.requireDiscountApproval ? "left-7" : "left-1"}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Currency & Tax */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800">Currency & Tax</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Default currency and applicable tax rate.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Default Currency</label>
              <select
                name="defaultCurrency"
                value={formData.defaultCurrency}
                onChange={handleText}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="UGX">Ugandan Shilling (UGX)</option>
                <option value="TZS">Tanzanian Shilling (TZS)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="ZAR">South African Rand (ZAR)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tax Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleText}
                  placeholder="e.g. 16"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Leave empty or 0 if tax does not apply.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
