"use client";

import React, { useState, useTransition } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Download,
  Printer,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  Wallet,
  Receipt,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  FinancialOverviewData,
  FilterOptions,
  getFinancialOverviewData,
} from "./actions";

interface OverviewClientProps {
  initialData: FinancialOverviewData;
  filterOptions: FilterOptions;
}

export default function OverviewClient({
  initialData,
  filterOptions,
}: OverviewClientProps) {
  const [data, setData] = useState<FinancialOverviewData>(initialData);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [activeAgingFilter, setActiveAgingFilter] = useState<string | null>(null);
  const [debtorSearch, setDebtorSearch] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (yearId: string, termId: string) => {
    setSelectedYear(yearId);
    setSelectedTerm(termId);

    startTransition(async () => {
      try {
        const updated = await getFinancialOverviewData(
          termId === "all" ? undefined : termId,
          yearId === "all" ? undefined : yearId
        );
        setData(updated);
      } catch (err) {
        console.error("Failed to filter financial data:", err);
      }
    });
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) {
      return `KSh ${(val / 1_000_000).toFixed(1)}M`;
    }
    if (val >= 1_000) {
      return `KSh ${(val / 1_000).toFixed(0)}K`;
    }
    return `KSh ${val.toLocaleString()}`;
  };

  const formatFullCurrency = (val: number) => {
    return `KSh ${Math.round(val).toLocaleString()}`;
  };

  // Filter overdue accounts based on search and aging bracket selection
  const filteredOverdueAccounts = data.overdueAccounts.filter((account) => {
    const matchesSearch =
      account.studentName.toLowerCase().includes(debtorSearch.toLowerCase()) ||
      account.studentAdmission.toLowerCase().includes(debtorSearch.toLowerCase()) ||
      account.invoiceNumber.toLowerCase().includes(debtorSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (activeAgingFilter === "0-30") return account.daysOverdue <= 30;
    if (activeAgingFilter === "31-60") return account.daysOverdue > 30 && account.daysOverdue <= 60;
    if (activeAgingFilter === "61-90") return account.daysOverdue > 60 && account.daysOverdue <= 90;
    if (activeAgingFilter === "90+") return account.daysOverdue > 90;

    return true;
  });

  const exportCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Total Revenue", data.metrics.totalRevenue],
      ["Total Expenses", data.metrics.totalExpenses],
      ["Net Position", data.metrics.netPosition],
      ["Fees Collected", data.metrics.feesCollected],
      ["Outstanding Fees", data.metrics.outstandingFees],
      ["Collection Rate", `${data.metrics.collectionRate}%`],
      [],
      ["Student Name", "Admission No", "Class", "Invoice No", "Balance Due", "Days Overdue", "Due Date"],
      ...data.overdueAccounts.map((a) => [
        a.studentName,
        a.studentAdmission,
        a.className,
        a.invoiceNumber,
        a.balanceDue,
        a.daysOverdue,
        a.dueDate,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_overview_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Controls & Global Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Executive Financial Overview</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live DB
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Real-time accounting aggregation, collection telemetry, and budget variance intelligence.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => handleFilterChange(e.target.value, selectedTerm)}
              disabled={isPending}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Academic Years</option>
              {filterOptions.years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.isActive ? "★" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTerm}
              onChange={(e) => handleFilterChange(selectedYear, e.target.value)}
              disabled={isPending}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Terms</option>
              {filterOptions.terms
                .filter((t) => selectedYear === "all" || t.yearId === selectedYear)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.isActive ? "★" : ""}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-900 hover:bg-secondary-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary-900/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100/90 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Total Revenue</div>
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 tracking-tight">
            {formatCurrency(data.metrics.totalRevenue)}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700/80 mt-1 flex items-center gap-1">
            <span>{data.metrics.invoiceCount} invoices billed</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-rose-50/70 hover:bg-rose-50 border border-rose-100/90 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-700">Total Expenses</div>
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900 tracking-tight">
            {formatCurrency(data.metrics.totalExpenses)}
          </div>
          <div className="text-[11px] font-semibold text-rose-700/80 mt-1">
            {data.metrics.totalRevenue > 0
              ? `${Math.round((data.metrics.totalExpenses / data.metrics.totalRevenue) * 100)}% of revenue`
              : "Operational burn"}
          </div>
        </div>

        {/* Net Position / Net Income */}
        <div className="bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100/90 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Net Position</div>
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-950 tracking-tight">
            {formatCurrency(data.metrics.netPosition)}
          </div>
          <div className="text-[11px] font-bold text-indigo-700 mt-1 flex items-center gap-1">
            {data.metrics.netPosition >= 0 ? (
              <span className="text-emerald-700 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Operating Surplus
              </span>
            ) : (
              <span className="text-rose-700 flex items-center">
                <ArrowDownRight className="w-3 h-3" /> Operating Deficit
              </span>
            )}
          </div>
        </div>

        {/* Fees Collected */}
        <div className="bg-white/80 hover:bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fees Collected</div>
            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(data.metrics.feesCollected)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            {data.metrics.paidInvoiceCount} accounts settled
          </div>
        </div>

        {/* Outstanding Fees */}
        <div className="bg-amber-50/70 hover:bg-amber-50 border border-amber-100/90 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Outstanding Fees</div>
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 tracking-tight">
            {formatCurrency(data.metrics.outstandingFees)}
          </div>
          <div className="text-[11px] font-semibold text-amber-700/80 mt-1">
            {data.metrics.unpaidInvoiceCount} pending balances
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white/80 hover:bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Collection Rate</div>
            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {data.metrics.collectionRate}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                data.metrics.collectionRate >= 80
                  ? "bg-emerald-500"
                  : data.metrics.collectionRate >= 60
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(data.metrics.collectionRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Aging vs Budget Variances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Arrears Aging */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" /> Fee Arrears Aging
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Total Overdue: <strong className="text-slate-800">{formatFullCurrency(data.aging.totalArrears)}</strong>
              </p>
            </div>
            {activeAgingFilter && (
              <button
                onClick={() => setActiveAgingFilter(null)}
                className="text-[11px] font-bold text-primary-700 hover:underline cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* 0-30 days */}
            <div
              onClick={() =>
                setActiveAgingFilter(activeAgingFilter === "0-30" ? null : "0-30")
              }
              className={`flex items-center justify-between p-3.5 bg-white/90 backdrop-blur-xl border rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all ${
                activeAgingFilter === "0-30"
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">0 - 30 days overdue</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">({data.aging.bracket0to30.count} invoices)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-emerald-700 text-sm">
                  {formatCurrency(data.aging.bracket0to30.amount)}
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  {data.aging.bracket0to30.percentage}% of arrears
                </div>
              </div>
            </div>

            {/* 31-60 days */}
            <div
              onClick={() =>
                setActiveAgingFilter(activeAgingFilter === "31-60" ? null : "31-60")
              }
              className={`flex items-center justify-between p-3.5 bg-white/90 backdrop-blur-xl border rounded-xl shadow-sm hover:border-amber-300 hover:shadow-md cursor-pointer transition-all ${
                activeAgingFilter === "31-60"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">31 - 60 days overdue</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">({data.aging.bracket31to60.count} invoices)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-amber-700 text-sm">
                  {formatCurrency(data.aging.bracket31to60.amount)}
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  {data.aging.bracket31to60.percentage}% of arrears
                </div>
              </div>
            </div>

            {/* 61-90 days */}
            <div
              onClick={() =>
                setActiveAgingFilter(activeAgingFilter === "61-90" ? null : "61-90")
              }
              className={`flex items-center justify-between p-3.5 bg-white/90 backdrop-blur-xl border rounded-xl shadow-sm hover:border-rose-300 hover:shadow-md cursor-pointer transition-all ${
                activeAgingFilter === "61-90"
                  ? "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/40"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">61 - 90 days overdue</span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">({data.aging.bracket61to90.count} invoices)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-rose-600 text-sm">
                  {formatCurrency(data.aging.bracket61to90.amount)}
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  {data.aging.bracket61to90.percentage}% of arrears
                </div>
              </div>
            </div>

            {/* 90+ days */}
            <div
              onClick={() =>
                setActiveAgingFilter(activeAgingFilter === "90+" ? null : "90+")
              }
              className={`flex items-center justify-between p-3.5 bg-rose-50/80 border rounded-xl shadow-sm hover:border-rose-300 hover:shadow-md cursor-pointer transition-all ${
                activeAgingFilter === "90+"
                  ? "border-rose-600 ring-2 ring-rose-600/20 bg-rose-100/60"
                  : "border-rose-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-700" />
                <div>
                  <span className="font-bold text-rose-900 text-sm">90+ days overdue (Critical)</span>
                  <span className="text-xs text-rose-500 ml-2 font-medium">({data.aging.bracket90Plus.count} invoices)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-rose-800 text-sm">
                  {formatCurrency(data.aging.bracket90Plus.amount)}
                </div>
                <div className="text-[10px] font-bold text-rose-600">
                  {data.aging.bracket90Plus.percentage}% of arrears
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Variances */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" /> Departmental Budget Variances
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitoring actual departmental spend vs allocations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {data.budgetVariances.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    item.status === "Over Budget"
                      ? "bg-rose-500"
                      : item.status === "On Track"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.department}</h4>
                    <div className="text-xs text-slate-500 mt-1 flex gap-4">
                      <span>
                        Budget: <strong className="text-slate-700">{formatCurrency(item.budget)}</strong>
                      </span>
                      <span>
                        Actual:{" "}
                        <strong
                          className={
                            item.status === "Over Budget" ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"
                          }
                        >
                          {formatCurrency(item.actual)}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-black flex items-center gap-1 ${
                      item.status === "Over Budget"
                        ? "bg-rose-100 text-rose-700"
                        : item.status === "On Track"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {item.variancePercent > 0 ? `+${item.variancePercent}% ⚠` : `${item.variancePercent}%`}
                  </div>
                </div>

                {/* Utilization meter */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.utilization > 100
                        ? "bg-rose-500"
                        : item.utilization >= 85
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(item.utilization, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Revenue Streams & Recent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Streams Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-400" /> Revenue Stream Composition
          </h3>
          <div className="space-y-4">
            {data.revenueStreams.map((stream, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{stream.category}</span>
                  <span className="text-slate-900">{formatCurrency(stream.amount)} ({stream.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-800 rounded-full transition-all"
                    style={{ width: `${stream.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payment Receipts */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" /> Recent Receipts & Fee Collections
            </h3>
            <span className="text-xs font-bold text-slate-400">Latest Live Transactions</span>
          </div>

          {data.recentPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              No recent payment transactions recorded for this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                    <th className="pb-2.5">Receipt #</th>
                    <th className="pb-2.5">Student</th>
                    <th className="pb-2.5">Method</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-bold text-primary-900">{p.receiptNumber}</td>
                      <td className="py-2.5 font-medium text-slate-800">{p.studentName}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {p.paymentMethod.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500">{p.paymentDate}</td>
                      <td className="py-2.5 font-black text-emerald-700 text-right">
                        {formatFullCurrency(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Accounts & Debtors Intelligence Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Outstanding Accounts & Receivables
              {activeAgingFilter && (
                <span className="ml-2 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Filtered: {activeAgingFilter} days
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Showing {filteredOverdueAccounts.length} students with unpaid or overdue invoice balances.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, admission, invoice..."
              value={debtorSearch}
              onChange={(e) => setDebtorSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-900 shadow-sm"
            />
          </div>
        </div>

        {filteredOverdueAccounts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-bold text-slate-700">No overdue accounts found</p>
            <p className="text-xs text-slate-400 mt-1">All accounts are settled or match no filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <th className="py-3 px-6">Student & Admission</th>
                  <th className="py-3 px-6">Class</th>
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Days Overdue</th>
                  <th className="py-3 px-6 text-right">Balance Due</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOverdueAccounts.slice(0, 15).map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{account.studentName}</div>
                      <div className="text-[10px] font-medium text-slate-400">{account.studentAdmission}</div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">{account.className}</td>
                    <td className="py-3.5 px-6 font-bold text-primary-900">{account.invoiceNumber}</td>
                    <td className="py-3.5 px-6 text-slate-500">{account.dueDate}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${
                          account.daysOverdue > 90
                            ? "bg-rose-100 text-rose-800"
                            : account.daysOverdue > 60
                            ? "bg-orange-100 text-orange-800"
                            : account.daysOverdue > 30
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {account.daysOverdue}d overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-black text-rose-700 text-right">
                      {formatFullCurrency(account.balanceDue)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                        {account.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
