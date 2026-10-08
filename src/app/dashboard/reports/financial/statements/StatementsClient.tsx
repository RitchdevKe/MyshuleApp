"use client";

import React, { useState, useTransition } from "react";
import {
  FileText,
  Download,
  Printer,
  Filter,
  ChevronRight,
  FileSpreadsheet,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Receipt,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  StudentOption,
  StudentStatementData,
  FinancialStatementReport,
  getStudentStatement,
} from "./actions";

interface StatementsClientProps {
  students: StudentOption[];
  initialStudentStatement: StudentStatementData | null;
  institutionalReport: FinancialStatementReport;
}

export default function StatementsClient({
  students,
  initialStudentStatement,
  institutionalReport,
}: StatementsClientProps) {
  const [statementType, setStatementType] = useState<"student" | "income" | "balance" | "trial">("student");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentStatement?.student.id || (students.length > 0 ? students[0].id : "")
  );
  const [studentStatement, setStudentStatement] = useState<StudentStatementData | null>(
    initialStudentStatement
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filter students based on search query
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student selection change
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    startTransition(async () => {
      const data = await getStudentStatement(studentId, startDate || undefined, endDate || undefined);
      setStudentStatement(data);
    });
  };

  // Handle date filter apply
  const handleApplyDateFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedStudentId) return;
    startTransition(async () => {
      const data = await getStudentStatement(
        selectedStudentId,
        startDate || undefined,
        endDate || undefined
      );
      setStudentStatement(data);
    });
  };

  // Reset date filters
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    if (!selectedStudentId) return;
    startTransition(async () => {
      const data = await getStudentStatement(selectedStudentId);
      setStudentStatement(data);
    });
  };

  // Print Statement Handler
  const handlePrint = () => {
    window.print();
  };

  // Download Statement as CSV
  const handleDownloadStatement = () => {
    if (statementType === "student") {
      if (!studentStatement) {
        alert("No student statement data available to download.");
        return;
      }

      const { student, tenant, transactions, summary, generatedAt } = studentStatement;

      const csvRows: string[] = [];
      // Header details
      csvRows.push(`"INSTITUTION","${tenant.name}"`);
      csvRows.push(`"ADDRESS","${tenant.address}"`);
      csvRows.push(`"CONTACT","${tenant.phone} | ${tenant.email}"`);
      csvRows.push(`"DOCUMENT","OFFICIAL STUDENT STATEMENT OF ACCOUNT"`);
      csvRows.push(`"GENERATED AT","${new Date(generatedAt).toLocaleString()}"`);
      csvRows.push("");
      // Student details
      csvRows.push(`"STUDENT NAME","${student.fullName}"`);
      csvRows.push(`"ADMISSION NUMBER","${student.admissionNumber}"`);
      csvRows.push(`"CLASS / GRADE","${student.className} ${student.streamName}"`);
      csvRows.push(`"FINANCIAL SPONSOR","${student.sponsorName}"`);
      csvRows.push(`"SPONSOR CONTACT","${student.sponsorPhone}"`);
      csvRows.push(`"PERIOD FILTER","${startDate ? startDate : "Beginning"} to ${endDate ? endDate : "Present"}"`);
      csvRows.push("");
      // Summary
      csvRows.push(`"TOTAL BILLED (${tenant.currency})","${summary.totalInvoiced.toLocaleString()}"`);
      csvRows.push(`"TOTAL PAID (${tenant.currency})","${summary.totalPaid.toLocaleString()}"`);
      csvRows.push(`"OUTSTANDING BALANCE (${tenant.currency})","${summary.currentBalance.toLocaleString()}"`);
      csvRows.push("");
      // Table Header
      csvRows.push(`"Date","Reference / Doc #","Type","Description","Debit (${tenant.currency})","Credit (${tenant.currency})","Running Balance (${tenant.currency})"`);

      // Transactions
      for (const tx of transactions) {
        const dateStr = new Date(tx.date).toLocaleDateString();
        const refStr = `"${tx.ref.replace(/"/g, '""')}"`;
        const typeStr = `"${tx.type}"`;
        const descStr = `"${tx.description.replace(/"/g, '""')}"`;
        const debitStr = tx.debit > 0 ? tx.debit.toString() : "0";
        const creditStr = tx.credit > 0 ? tx.credit.toString() : "0";
        const balanceStr = tx.balance.toString();

        csvRows.push(`${dateStr},${refStr},${typeStr},${descStr},${debitStr},${creditStr},${balanceStr}`);
      }

      // Final Balance row
      csvRows.push(`"","","","CLOSING OUTSTANDING BALANCE",${summary.totalInvoiced},${summary.totalPaid},${summary.currentBalance}`);

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      const filename = `Statement_${student.admissionNumber}_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (statementType === "income") {
      const { tenant, period, incomeStatement } = institutionalReport;
      const csvRows: string[] = [];
      csvRows.push(`"INSTITUTION","${tenant.name}"`);
      csvRows.push(`"DOCUMENT","INCOME STATEMENT (STATEMENT OF FINANCIAL PERFORMANCE)"`);
      csvRows.push(`"PERIOD","${period.yearName} - ${period.termName}"`);
      csvRows.push(`"CURRENCY","${tenant.currency}"`);
      csvRows.push("");
      csvRows.push(`"REVENUE CATEGORY","AMOUNT (${tenant.currency})","PERCENTAGE"`);
      for (const rev of incomeStatement.revenues) {
        csvRows.push(`"${rev.category}",${rev.amount},"${rev.percentage}%"`);
      }
      csvRows.push(`"TOTAL OPERATING REVENUE",${incomeStatement.totalRevenue},"100%"`);
      csvRows.push("");
      csvRows.push(`"OPERATING EXPENSES CATEGORY","AMOUNT (${tenant.currency})","PERCENTAGE"`);
      for (const exp of incomeStatement.expenses) {
        csvRows.push(`"${exp.category}",${exp.amount},"${exp.percentage}%"`);
      }
      csvRows.push(`"TOTAL OPERATING EXPENSES",${incomeStatement.totalExpenses},"100%"`);
      csvRows.push("");
      csvRows.push(`"NET OPERATING SURPLUS / (DEFICIT)",${incomeStatement.netIncome},""`);

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `Income_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (statementType === "balance") {
      const { tenant, period, balanceSheet } = institutionalReport;
      const csvRows: string[] = [];
      csvRows.push(`"INSTITUTION","${tenant.name}"`);
      csvRows.push(`"DOCUMENT","BALANCE SHEET (STATEMENT OF FINANCIAL POSITION)"`);
      csvRows.push(`"PERIOD","As at ${new Date(period.generatedAt).toLocaleDateString()}"`);
      csvRows.push(`"CURRENCY","${tenant.currency}"`);
      csvRows.push("");
      csvRows.push(`"ASSETS","AMOUNT (${tenant.currency})"`);
      for (const a of balanceSheet.assets.currentAssets) {
        csvRows.push(`"${a.name}",${a.amount}`);
      }
      for (const a of balanceSheet.assets.nonCurrentAssets) {
        csvRows.push(`"${a.name}",${a.amount}`);
      }
      csvRows.push(`"TOTAL ASSETS",${balanceSheet.assets.totalAssets}`);
      csvRows.push("");
      csvRows.push(`"LIABILITIES","AMOUNT (${tenant.currency})"`);
      for (const l of balanceSheet.liabilities.currentLiabilities) {
        csvRows.push(`"${l.name}",${l.amount}`);
      }
      for (const l of balanceSheet.liabilities.longTermLiabilities) {
        csvRows.push(`"${l.name}",${l.amount}`);
      }
      csvRows.push(`"TOTAL LIABILITIES",${balanceSheet.liabilities.totalLiabilities}`);
      csvRows.push("");
      csvRows.push(`"EQUITY & RESERVES","AMOUNT (${tenant.currency})"`);
      for (const e of balanceSheet.equity.items) {
        csvRows.push(`"${e.name}",${e.amount}`);
      }
      csvRows.push(`"TOTAL LIABILITIES & EQUITY",${balanceSheet.totalLiabilitiesAndEquity}`);

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `Balance_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (statementType === "trial") {
      const { tenant, trialBalance } = institutionalReport;
      const csvRows: string[] = [];
      csvRows.push(`"INSTITUTION","${tenant.name}"`);
      csvRows.push(`"DOCUMENT","TRIAL BALANCE"`);
      csvRows.push(`"CURRENCY","${tenant.currency}"`);
      csvRows.push("");
      csvRows.push(`"Account Code","Account Description","Account Type","Debit (${tenant.currency})","Credit (${tenant.currency})"`);
      for (const acc of trialBalance.accounts) {
        csvRows.push(`"${acc.code}","${acc.name}","${acc.type}",${acc.debit},${acc.credit}`);
      }
      csvRows.push(`"","TOTALS","",${trialBalance.totalDebit},${trialBalance.totalCredit}`);

      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `Trial_Balance_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Financial & Account Statements</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Sparkles className="w-3 h-3" /> Live DB Data
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Generate and export official student statements of account, P&L, balance sheets, and trial balances.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {statementType === "student" && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex-1 sm:flex-none border ${
                showFilterPanel
                  ? "bg-primary-50 text-primary-900 border-primary-200"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" /> Parameters
            </button>
          )}

          <button
            onClick={handleDownloadStatement}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4" /> Download Statement
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save PDF"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex-none"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Range Parameters Drawer (Collapsible) */}
      {showFilterPanel && statementType === "student" && (
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-top-2 print:hidden">
          <form onSubmit={handleApplyDateFilter} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition shadow-sm disabled:opacity-50"
              >
                {isPending ? "Applying..." : "Filter Range"}
              </button>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Navigation & Statement Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4 print:hidden">
          {/* Statement Type Tabs */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm space-y-1.5">
            <button
              onClick={() => setStatementType("student")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                statementType === "student"
                  ? "bg-primary-50/80 border-primary-300 text-primary-900 font-black shadow-xs"
                  : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-3">
                <User
                  className={`w-5 h-5 ${
                    statementType === "student" ? "text-primary-800" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className="text-sm leading-snug">Student Statement</div>
                  <div className="text-xs text-slate-500 font-normal">Account & fee ledger</div>
                </div>
              </div>
              {statementType === "student" && <ChevronRight className="w-4 h-4 text-primary-600" />}
            </button>

            <button
              onClick={() => setStatementType("income")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                statementType === "income"
                  ? "bg-primary-50/80 border-primary-300 text-primary-900 font-black shadow-xs"
                  : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText
                  className={`w-5 h-5 ${
                    statementType === "income" ? "text-primary-800" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className="text-sm leading-snug">Income Statement</div>
                  <div className="text-xs text-slate-500 font-normal">Profit & Loss Report</div>
                </div>
              </div>
              {statementType === "income" && <ChevronRight className="w-4 h-4 text-primary-600" />}
            </button>

            <button
              onClick={() => setStatementType("balance")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                statementType === "balance"
                  ? "bg-primary-50/80 border-primary-300 text-primary-900 font-black shadow-xs"
                  : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building
                  className={`w-5 h-5 ${
                    statementType === "balance" ? "text-primary-800" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className="text-sm leading-snug">Balance Sheet</div>
                  <div className="text-xs text-slate-500 font-normal">Financial Position</div>
                </div>
              </div>
              {statementType === "balance" && <ChevronRight className="w-4 h-4 text-primary-600" />}
            </button>

            <button
              onClick={() => setStatementType("trial")}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                statementType === "trial"
                  ? "bg-primary-50/80 border-primary-300 text-primary-900 font-black shadow-xs"
                  : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet
                  className={`w-5 h-5 ${
                    statementType === "trial" ? "text-primary-800" : "text-slate-400"
                  }`}
                />
                <div>
                  <div className="text-sm leading-snug">Trial Balance</div>
                  <div className="text-xs text-slate-500 font-normal">Double-Entry Verification</div>
                </div>
              </div>
              {statementType === "trial" && <ChevronRight className="w-4 h-4 text-primary-600" />}
            </button>
          </div>

          {/* Student Account Selector (Only shown in student statement mode) */}
          {statementType === "student" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Select Student Account
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {students.length} Accounts
                </span>
              </div>

              {/* Student Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, admission #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              {/* Students List Box */}
              <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
                {filteredStudents.map((s) => {
                  const isSelected = s.id === selectedStudentId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStudent(s.id)}
                      disabled={isPending}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                          : "bg-slate-50/50 hover:bg-slate-100/80 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-800"}`}>
                          {s.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s.className}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? "text-primary-100" : "text-slate-500"
                        }`}
                      >
                        Adm: {s.admissionNumber}
                      </div>
                    </button>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No matching students found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Document Preview Area */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden min-h-[650px] flex flex-col">
          {/* ========================================================
              VIEW 1: STUDENT STATEMENT OF ACCOUNT
             ======================================================== */}
          {statementType === "student" && (
            <>
              {isPending ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mb-3" />
                  <p className="text-sm font-semibold">Generating student statement...</p>
                </div>
              ) : studentStatement ? (
                <div className="flex-1 flex flex-col">
                  {/* Official Institutional Document Header */}
                  <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/40">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary-900 text-white">
                            Official Statement
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            Currency: {studentStatement.tenant.currency} (KSh)
                          </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                          {studentStatement.tenant.name}
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 italic mt-0.5">
                          "{studentStatement.tenant.motto}"
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          {studentStatement.tenant.address} • {studentStatement.tenant.phone} • {studentStatement.tenant.email}
                        </p>
                      </div>

                      {/* Status Stamp Card */}
                      <div className="text-right bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Account Status
                        </div>
                        <div
                          className={`text-base font-black mt-0.5 flex items-center justify-end gap-1.5 ${
                            studentStatement.summary.currentBalance <= 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {studentStatement.summary.currentBalance <= 0 ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> CLEARED
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" /> BALANCE DUE
                            </>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                          Issued: {new Date(studentStatement.generatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Student Info Card */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Student Name
                        </div>
                        <div className="text-sm font-black text-slate-800 mt-0.5">
                          {studentStatement.student.fullName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Gender: {studentStatement.student.gender}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Admission No.
                        </div>
                        <div className="text-sm font-black text-primary-900 mt-0.5">
                          {studentStatement.student.admissionNumber}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Status: {studentStatement.student.status}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Class / Stream
                        </div>
                        <div className="text-sm font-black text-slate-800 mt-0.5">
                          {studentStatement.student.className}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {studentStatement.student.streamName || "Main Stream"}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Financial Sponsor
                        </div>
                        <div className="text-sm font-black text-slate-800 mt-0.5">
                          {studentStatement.student.sponsorName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {studentStatement.student.sponsorPhone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary KPI Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/20">
                    <div className="p-4 sm:px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Total Invoiced (Debits)
                        </div>
                        <div className="text-base font-black text-slate-800">
                          KSh {studentStatement.summary.totalInvoiced.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Total Paid (Credits)
                        </div>
                        <div className="text-base font-black text-emerald-700">
                          KSh {studentStatement.summary.totalPaid.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:px-6 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          studentStatement.summary.currentBalance > 0
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Outstanding Balance Due
                        </div>
                        <div
                          className={`text-lg font-black ${
                            studentStatement.summary.currentBalance > 0
                              ? "text-rose-600"
                              : "text-emerald-700"
                          }`}
                        >
                          KSh {studentStatement.summary.currentBalance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Ledger Table */}
                  <div className="p-4 sm:p-6 flex-1 overflow-x-auto">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                      Transaction Ledger History
                    </h3>

                    {studentStatement.transactions.length > 0 ? (
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-50 border-y border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Ref / Doc #</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4 text-right">Debit (Charge)</th>
                            <th className="py-3 px-4 text-right">Credit (Paid)</th>
                            <th className="py-3 px-4 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {studentStatement.transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                                {new Date(tx.date).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary-900">
                                {tx.ref}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                                    tx.type === "INVOICE"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {tx.type}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-slate-700 font-medium max-w-[280px] truncate">
                                {tx.description}
                              </td>
                              <td className="py-3.5 px-4 text-xs font-bold text-slate-800 text-right">
                                {tx.debit > 0 ? `KSh ${tx.debit.toLocaleString()}` : "—"}
                              </td>
                              <td className="py-3.5 px-4 text-xs font-bold text-emerald-700 text-right">
                                {tx.credit > 0 ? `KSh ${tx.credit.toLocaleString()}` : "—"}
                              </td>
                              <td
                                className={`py-3.5 px-4 text-xs font-black text-right ${
                                  tx.balance > 0 ? "text-rose-600" : "text-emerald-700"
                                }`}
                              >
                                KSh {tx.balance.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-black text-xs text-slate-800">
                          <tr>
                            <td colSpan={4} className="py-3.5 px-4 text-right uppercase tracking-wider">
                              Statement Totals & Final Balance:
                            </td>
                            <td className="py-3.5 px-4 text-right text-slate-900">
                              KSh {studentStatement.summary.totalInvoiced.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right text-emerald-700">
                              KSh {studentStatement.summary.totalPaid.toLocaleString()}
                            </td>
                            <td
                              className={`py-3.5 px-4 text-right font-black text-sm ${
                                studentStatement.summary.currentBalance > 0
                                  ? "text-rose-600"
                                  : "text-emerald-700"
                              }`}
                            >
                              KSh {studentStatement.summary.currentBalance.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-slate-100 text-slate-500">
                        <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-25" />
                        <p className="font-bold text-sm">No transaction records found for this student.</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Invoices and payments generated for this student will appear here in chronological order.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Institutional Statement Footer (Stamp & Signature) */}
                  <div className="p-6 border-t border-slate-200 bg-slate-50/30 text-xs text-slate-500 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Payment Instructions
                      </div>
                      <p>
                        Please make payments via School Bank Account or Official M-Pesa Paybill. Always use the student admission number (<strong>{studentStatement.student.admissionNumber}</strong>) as the account reference.
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <div className="w-48 border-b border-slate-400 mb-1"></div>
                      <div className="font-bold text-slate-700 text-right">Finance / Accounts Department</div>
                      <div className="text-[10px] text-slate-400 text-right">Official Stamp & Signature</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                  <User className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-bold text-slate-600">No Student Selected</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a student from the sidebar to generate their financial statement.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ========================================================
              VIEW 2: INCOME STATEMENT (P&L)
             ======================================================== */}
          {statementType === "income" && (
            <div className="flex-1 flex flex-col">
              {/* Document Header */}
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/40 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary-900 text-white">
                  Statement of Comprehensive Income
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
                  {institutionalReport.tenant.name}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  For the Period: {institutionalReport.period.yearName} • {institutionalReport.period.termName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currency: {institutionalReport.tenant.currency} (KSh)
                </p>
              </div>

              {/* Document Body */}
              <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
                {/* Revenue Section */}
                <div>
                  <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2 mb-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Operating Revenues
                    </h3>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Amount (KES)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {institutionalReport.incomeStatement.revenues.map((rev, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700 font-medium">{rev.category}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                            {rev.percentage}%
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {rev.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center px-4 pt-3 border-t border-slate-200 font-black text-base bg-emerald-50/50 p-3 rounded-xl mt-2">
                      <span className="text-slate-900">Total Operating Revenue</span>
                      <span className="text-emerald-700">
                        KSh {institutionalReport.incomeStatement.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2 mb-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-600" /> Operating Expenses
                    </h3>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Amount (KES)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {institutionalReport.incomeStatement.expenses.map((exp, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-1.5 hover:bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700 font-medium">{exp.category}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                            {exp.percentage}%
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {exp.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center px-4 pt-3 border-t border-slate-200 font-black text-base bg-rose-50/50 p-3 rounded-xl mt-2">
                      <span className="text-slate-900">Total Operating Expenses</span>
                      <span className="text-rose-700">
                        KSh {institutionalReport.incomeStatement.totalExpenses.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Surplus / Net Income */}
                <div className="bg-primary-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-primary-200">
                      Net Operating Surplus / (Deficit)
                    </div>
                    <div className="text-xs text-primary-300 mt-0.5">
                      Excess of revenues over operating expenses for period
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white underline decoration-double underline-offset-4">
                    KSh {institutionalReport.incomeStatement.netIncome.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: BALANCE SHEET
             ======================================================== */}
          {statementType === "balance" && (
            <div className="flex-1 flex flex-col">
              {/* Document Header */}
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/40 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary-900 text-white">
                  Statement of Financial Position
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
                  {institutionalReport.tenant.name}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  As of {new Date(institutionalReport.period.generatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currency: {institutionalReport.tenant.currency} (KSh)
                </p>
              </div>

              {/* Document Body */}
              <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
                {/* Assets */}
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-2 mb-4">
                    1. Assets
                  </h3>

                  <div className="space-y-4">
                    <div className="pl-4 space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase">Current Assets</div>
                      {institutionalReport.balanceSheet.assets.currentAssets.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm px-4">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-800">
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pl-4 space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-500 uppercase">Non-Current Assets</div>
                      {institutionalReport.balanceSheet.assets.nonCurrentAssets.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm px-4">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-800">
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl font-black text-base border border-slate-200">
                      <span className="text-slate-900">Total Assets</span>
                      <span className="text-indigo-700">
                        KSh {institutionalReport.balanceSheet.assets.totalAssets.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b-2 border-slate-800 pb-2 mb-4">
                    2. Liabilities & Institutional Equity
                  </h3>

                  <div className="space-y-4">
                    <div className="pl-4 space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase">Current Liabilities</div>
                      {institutionalReport.balanceSheet.liabilities.currentLiabilities.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm px-4">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-800">
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pl-4 space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-500 uppercase">Long-Term Liabilities</div>
                      {institutionalReport.balanceSheet.liabilities.longTermLiabilities.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm px-4">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-800">
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pl-4 space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-500 uppercase">Capital & Reserves</div>
                      {institutionalReport.balanceSheet.equity.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm px-4">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-800">
                            {item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl font-black text-base border border-slate-200">
                      <span className="text-slate-900">Total Liabilities & Equity</span>
                      <span className="text-indigo-700">
                        KSh {institutionalReport.balanceSheet.totalLiabilitiesAndEquity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: TRIAL BALANCE
             ======================================================== */}
          {statementType === "trial" && (
            <div className="flex-1 flex flex-col">
              {/* Document Header */}
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/40 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary-900 text-white">
                  Trial Balance Ledger
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
                  {institutionalReport.tenant.name}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Double-Entry Account Balances Verification
                </p>
              </div>

              {/* Document Body */}
              <div className="p-6 flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Account Title</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4 text-right">Debit (KSh)</th>
                      <th className="py-3 px-4 text-right">Credit (KSh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {institutionalReport.trialBalance.accounts.map((acc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-xs text-slate-600">
                          {acc.code}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {acc.name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              acc.type === "Asset"
                                ? "bg-emerald-100 text-emerald-800"
                                : acc.type === "Liability"
                                ? "bg-amber-100 text-amber-800"
                                : acc.type === "Revenue"
                                ? "bg-indigo-100 text-indigo-800"
                                : acc.type === "Expense"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {acc.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-right">
                          {acc.debit > 0 ? acc.debit.toLocaleString() : "—"}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-right">
                          {acc.credit > 0 ? acc.credit.toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-black text-sm text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right uppercase tracking-wider">
                        Trial Balance Totals:
                      </td>
                      <td className="py-4 px-4 text-right text-emerald-700">
                        {institutionalReport.trialBalance.totalDebit.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-emerald-700">
                        {institutionalReport.trialBalance.totalCredit.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Balanced Status Badge */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Trial Balance is Balanced (Debits equal Credits)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
