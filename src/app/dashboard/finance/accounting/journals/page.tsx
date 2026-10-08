import React from "react";
import prisma from "@/lib/prisma";
import JournalClient from "./JournalClient";
import { FileText, Calculator, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function JournalsPage() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    return <div>No tenant found. Please set up a tenant first.</div>;
  }

  const journals = await prisma.journalEntry.findMany({
    where: { tenantId: tenant.id },
    include: {
      lines: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const accounts = await prisma.chartOfAccount.findMany({
    where: { tenantId: tenant.id },
    orderBy: { accountCode: "asc" },
  });

  // Aggregations for Top Cards
  const totalEntries = journals.length;
  const postedEntries = journals.filter(j => j.status === "POSTED").length;
  const draftEntries = journals.filter(j => j.status === "DRAFT").length;
  
  // Calculate total amount (sum of all debits across all posted entries, or all entries depending on preference. Let's do all entries)
  const totalDebits = journals.reduce((acc, journal) => {
    const journalTotal = journal.lines.reduce((sum, line) => sum + line.debit, 0);
    return acc + journalTotal;
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Journal Entries</h1>
        <p className="text-slate-500 mt-1">Manage and record double-entry accounting records.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Total Entries</p>
              <h3 className="text-2xl font-black text-slate-800">{totalEntries}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Posted</p>
              <h3 className="text-2xl font-black text-slate-800">{postedEntries}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Drafts</p>
              <h3 className="text-2xl font-black text-slate-800">{draftEntries}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Total Recorded (KSh)</p>
              <h3 className="text-2xl font-black text-slate-800">
                {totalDebits.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Client UI */}
      <JournalClient journals={journals} accounts={accounts} />
    </div>
  );
}
