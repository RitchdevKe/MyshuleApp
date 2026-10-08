"use client";

import React, { useState, useTransition } from "react";
import {
  AlertCircle,
  FileText,
  Send,
  Mail,
  Search,
  Download,
  CheckCircle2,
  Phone,
  X,
  Printer,
  RefreshCw,
} from "lucide-react";
import {
  DebtorRecord,
  ReceivablesReportData,
  sendBulkReminders,
  sendIndividualReminder,
} from "./actions";

interface ReceivablesClientProps {
  initialData: ReceivablesReportData;
}

export default function ReceivablesClient({ initialData }: ReceivablesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAging, setSelectedAging] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Selected debtor for statement view modal
  const [statementDebtor, setStatementDebtor] = useState<DebtorRecord | null>(null);

  const { summary, debtors } = initialData;

  // Format currency helper
  const formatKsh = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Compact currency helper for KPI cards
  const formatCompactKsh = (amount: number) => {
    if (amount >= 1_000_000) {
      return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `KSh ${(amount / 1_000).toFixed(1)}K`;
    }
    return `KSh ${amount.toLocaleString()}`;
  };

  // Filter debtors based on search and filters
  const filteredDebtors = debtors.filter((debtor) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      debtor.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.parentPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debtor.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAging =
      selectedAging === "ALL" || debtor.agingCategory === selectedAging;

    const matchesStatus =
      selectedStatus === "ALL" || debtor.status === selectedStatus;

    return matchesSearch && matchesAging && matchesStatus;
  });

  const handleBulkReminders = () => {
    startTransition(async () => {
      const targetCategory = selectedAging !== "ALL" ? selectedAging : undefined;
      const res = await sendBulkReminders(targetCategory);
      if (res.success) {
        setNotification({ type: "success", message: res.message });
      } else {
        setNotification({ type: "error", message: res.message });
      }
    });
  };

  const handleSingleReminder = (debtor: DebtorRecord) => {
    startTransition(async () => {
      const res = await sendIndividualReminder(debtor.id, debtor.studentName);
      if (res.success) {
        setNotification({ type: "success", message: res.message });
      } else {
        setNotification({ type: "error", message: res.message });
      }
    });
  };

  const handleExportCSV = () => {
    if (filteredDebtors.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Invoice #",
      "Admission #",
      "Student Name",
      "Grade",
      "Parent Name",
      "Parent Phone",
      "Total Amount",
      "Amount Paid",
      "Balance Due",
      "Due Date",
      "Days Overdue",
      "Aging Category",
      "Status",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredDebtors.map((d) =>
        [
          `"${d.invoiceNumber}"`,
          `"${d.admissionNumber}"`,
          `"${d.studentName}"`,
          `"${d.grade}"`,
          `"${d.parentName}"`,
          `"${d.parentPhone}"`,
          d.totalAmount,
          d.amountPaid,
          d.amountDue,
          `"${d.dueDate.split("T")[0]}"`,
          d.daysOverdue,
          `"${d.agingCategory}"`,
          `"${d.status}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `accounts_receivable_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Accounts Receivable</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track outstanding fee balances, monitor debtor aging, and execute debtor follow-ups.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={handleBulkReminders}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm disabled:opacity-50 flex-1 sm:flex-none cursor-pointer"
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Bulk Reminders
          </button>
        </div>
      </div>

      {/* Notification Toast/Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-sm font-bold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overall Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Total Outstanding
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {formatKsh(summary.totalReceivables)}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Across {summary.totalDebtors} unpaid account{summary.totalDebtors === 1 ? "" : "s"}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Total Invoiced
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {formatKsh(summary.totalOriginalAmount)}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Collected: {formatKsh(summary.totalCollectedAmount)}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Collection Progress
          </span>
          <div className="text-2xl font-black text-primary-900 mt-1">
            {summary.collectionRate}%
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-primary-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, summary.collectionRate))}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            High Risk (90+ Days)
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {formatKsh(summary.aging.ninetyPlus.amount)}
          </div>
          <p className="text-xs font-bold text-rose-600 mt-1">
            {summary.aging.ninetyPlus.count} critical debtor{summary.aging.ninetyPlus.count === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Aging Summary Interactive Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Aging Breakdown (Click to filter)
          </h3>
          {selectedAging !== "ALL" && (
            <button
              onClick={() => setSelectedAging("ALL")}
              className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer"
            >
              Clear aging filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 0-30 Days */}
          <div
            onClick={() =>
              setSelectedAging((prev) => (prev === "0-30 Days" ? "ALL" : "0-30 Days"))
            }
            className={`p-4 rounded-2xl shadow-sm text-center cursor-pointer transition-all border ${
              selectedAging === "0-30 Days"
                ? "bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-500/20"
                : "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">
              0-30 Days
            </div>
            <div className="text-xl font-black text-emerald-800">
              {formatCompactKsh(summary.aging.zeroToThirty.amount)}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-0.5">
              {summary.aging.zeroToThirty.count} invoice{summary.aging.zeroToThirty.count === 1 ? "" : "s"}
            </div>
          </div>

          {/* 31-60 Days */}
          <div
            onClick={() =>
              setSelectedAging((prev) => (prev === "31-60 Days" ? "ALL" : "31-60 Days"))
            }
            className={`p-4 rounded-2xl shadow-sm text-center cursor-pointer transition-all border ${
              selectedAging === "31-60 Days"
                ? "bg-amber-100/80 border-amber-500 ring-2 ring-amber-500/20"
                : "bg-amber-50 border-amber-100 hover:border-amber-300"
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1">
              31-60 Days
            </div>
            <div className="text-xl font-black text-amber-800">
              {formatCompactKsh(summary.aging.thirtyOneToSixty.amount)}
            </div>
            <div className="text-xs font-semibold text-amber-600 mt-0.5">
              {summary.aging.thirtyOneToSixty.count} invoice{summary.aging.thirtyOneToSixty.count === 1 ? "" : "s"}
            </div>
          </div>

          {/* 61-90 Days */}
          <div
            onClick={() =>
              setSelectedAging((prev) => (prev === "61-90 Days" ? "ALL" : "61-90 Days"))
            }
            className={`p-4 rounded-2xl shadow-sm text-center cursor-pointer transition-all border ${
              selectedAging === "61-90 Days"
                ? "bg-orange-100/80 border-orange-500 ring-2 ring-orange-500/20"
                : "bg-orange-50 border-orange-200 hover:border-orange-300"
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-600 mb-1">
              61-90 Days
            </div>
            <div className="text-xl font-black text-orange-800">
              {formatCompactKsh(summary.aging.sixtyOneToNinety.amount)}
            </div>
            <div className="text-xs font-semibold text-orange-600 mt-0.5">
              {summary.aging.sixtyOneToNinety.count} invoice{summary.aging.sixtyOneToNinety.count === 1 ? "" : "s"}
            </div>
          </div>

          {/* 90+ Days */}
          <div
            onClick={() =>
              setSelectedAging((prev) => (prev === "90+ Days" ? "ALL" : "90+ Days"))
            }
            className={`p-4 rounded-2xl shadow-sm text-center cursor-pointer transition-all border ${
              selectedAging === "90+ Days"
                ? "bg-rose-100/80 border-rose-500 ring-2 ring-rose-500/20"
                : "bg-rose-50 border-rose-200 hover:border-rose-300"
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 mb-1">
              90+ Days
            </div>
            <div className="text-xl font-black text-rose-800">
              {formatCompactKsh(summary.aging.ninetyPlus.amount)}
            </div>
            <div className="text-xs font-semibold text-rose-600 mt-0.5">
              {summary.aging.ninetyPlus.count} invoice{summary.aging.ninetyPlus.count === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      {/* Debtor List & Filters */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Debtor Accounts ({filteredDebtors.length})
            </h3>
            {filteredDebtors.length !== debtors.length && (
              <span className="text-xs font-semibold text-slate-400">
                (filtered from {debtors.length})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, parent, ID..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Aging Filter */}
            <select
              value={selectedAging}
              onChange={(e) => setSelectedAging(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-primary-900 cursor-pointer"
            >
              <option value="ALL">All Aging Buckets</option>
              <option value="0-30 Days">0-30 Days</option>
              <option value="31-60 Days">31-60 Days</option>
              <option value="61-90 Days">61-90 Days</option>
              <option value="90+ Days">90+ Days</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:border-primary-900 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Critical">Critical (90+ Days)</option>
              <option value="Warning">Warning (31-90 Days)</option>
              <option value="Notice">Notice (0-30 Days)</option>
            </select>

            {(searchTerm || selectedAging !== "ALL" || selectedStatus !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedAging("ALL");
                  setSelectedStatus("ALL");
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredDebtors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-base font-bold text-slate-700">No Debtors Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {debtors.length === 0
                  ? "There are currently no outstanding receivables. All invoices are settled."
                  : "No debtor records match your active search and filter criteria."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Parent / Contact
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Amount Due
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aging
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDebtors.map((debtor) => (
                  <tr key={debtor.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Column */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-800">
                        {debtor.studentName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600">
                          {debtor.admissionNumber}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-medium">
                          {debtor.grade}
                        </span>
                      </div>
                    </td>

                    {/* Parent Column */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                        {debtor.parentName}
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1 rounded">
                          {debtor.parentRelationship}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {debtor.parentPhone}
                      </div>
                    </td>

                    {/* Invoice Column */}
                    <td className="py-4 px-6">
                      <div className="text-xs font-bold text-slate-700">
                        {debtor.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {debtor.termName}
                      </div>
                    </td>

                    {/* Amount Due Column */}
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-rose-600">
                        {formatKsh(debtor.amountDue)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Total: {formatKsh(debtor.totalAmount)}
                      </div>
                    </td>

                    {/* Aging Column */}
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-slate-700">
                        {debtor.daysOverdue} {debtor.daysOverdue === 1 ? "day" : "days"}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Due: {new Date(debtor.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                          debtor.status === "Critical"
                            ? "bg-rose-100 text-rose-700"
                            : debtor.status === "Warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {debtor.status === "Critical" && (
                          <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        )}
                        {debtor.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSingleReminder(debtor)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-300 rounded-lg shadow-sm transition-colors cursor-pointer"
                          title={`Send payment reminder to ${debtor.parentName}`}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStatementDebtor(debtor)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-300 rounded-lg shadow-sm transition-colors cursor-pointer"
                          title="View Invoice Statement"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Statement Quick-View Modal */}
      {statementDebtor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Statement Preview
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  {statementDebtor.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setStatementDebtor(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-slate-400">Student</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {statementDebtor.studentName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {statementDebtor.admissionNumber} • {statementDebtor.grade}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Parent / Sponsor</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {statementDebtor.parentName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {statementDebtor.parentPhone}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Billing Period</span>
                  <span className="font-bold text-slate-800">{statementDebtor.termName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Issue Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(statementDebtor.issueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Due Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(statementDebtor.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Total Invoiced Amount</span>
                  <span className="font-bold text-slate-800">
                    {formatKsh(statementDebtor.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Amount Settled</span>
                  <span className="font-bold text-emerald-600">
                    {formatKsh(statementDebtor.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between py-2 bg-rose-50 px-4 rounded-xl border border-rose-100">
                  <span className="text-rose-700 font-bold">Outstanding Balance Due</span>
                  <span className="font-black text-rose-700 text-base">
                    {formatKsh(statementDebtor.amountDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => {
                  handleSingleReminder(statementDebtor);
                  setStatementDebtor(null);
                }}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
