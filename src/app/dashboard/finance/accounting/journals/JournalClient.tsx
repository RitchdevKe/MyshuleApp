"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, ChevronRight, X, Trash2 } from "lucide-react";
import { createJournalEntry } from "./actions";
import { useRouter } from "next/navigation";

export default function JournalClient({ journals, accounts }: { journals: any[]; accounts: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    description: "",
    entryDate: new Date().toISOString().split("T")[0],
  });
  const [lines, setLines] = useState([
    { accountId: "", debit: 0, credit: 0, description: "" },
    { accountId: "", debit: 0, credit: 0, description: "" },
  ]);

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.entryNumber.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || j.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddLine = () => {
    setLines([...lines, { accountId: "", debit: 0, credit: 0, description: "" }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: string | number) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    
    // Auto-balance if one side is filled
    if (field === 'debit' && Number(value) > 0) {
      newLines[index].credit = 0;
    }
    if (field === 'credit' && Number(value) > 0) {
      newLines[index].debit = 0;
    }
    
    setLines(newLines);
  };

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.description || !formData.entryDate) {
      setError("Description and Entry Date are required.");
      return;
    }
    if (lines.some(l => !l.accountId)) {
      setError("Please select an account for all lines.");
      return;
    }
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      setError("Total Debit must equal Total Credit.");
      return;
    }
    if (totalDebit === 0 && totalCredit === 0) {
      setError("Journal entry must have a non-zero amount.");
      return;
    }

    try {
      setLoading(true);
      await createJournalEntry({
        description: formData.description,
        entryDate: formData.entryDate,
        lines: lines.map(l => ({
          ...l,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
        }))
      });
      setIsModalOpen(false);
      setFormData({
        description: "",
        entryDate: new Date().toISOString().split("T")[0],
      });
      setLines([
        { accountId: "", debit: 0, credit: 0, description: "" },
        { accountId: "", debit: 0, credit: 0, description: "" },
      ]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search journals by ID or description..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Draft">Draft</option>
            <option value="Posted">Posted</option>
          </select>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Journal Entry
        </button>
      </div>

      {/* List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg">Journal Entries</h3>
          <span className="text-sm font-medium text-slate-500">Showing {filteredJournals.length} entries</span>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-primary-900 text-xs uppercase font-bold text-white">
              <tr>
                <th className="px-6 py-4">Entry ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Total Amount (KSh)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((journal) => {
                  const totalAmount = journal.lines.reduce((sum: number, line: any) => sum + line.debit, 0);

                  return (
                    <tr key={journal.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{journal.entryNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-500 font-medium">
                          {new Date(journal.entryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{journal.description}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-800">
                        {totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold
                          ${
                            journal.status === "POSTED"
                              ? "bg-green-50 text-green-700"
                              : journal.status === "DRAFT"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-orange-50 text-orange-700"
                          }
                        `}
                        >
                          {journal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-900 ml-auto transition-colors" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No journal entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">New Journal Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <form id="journal-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Description</label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-slate-50"
                      placeholder="e.g., Accrued Payroll Expenses"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.entryDate}
                      onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Lines</h3>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="text-sm font-bold text-primary-900 hover:text-primary-800 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Line
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-bold">Account</th>
                          <th className="px-4 py-3 font-bold">Description</th>
                          <th className="px-4 py-3 font-bold text-right w-32">Debit</th>
                          <th className="px-4 py-3 font-bold text-right w-32">Credit</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lines.map((line, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <select
                                required
                                value={line.accountId}
                                onChange={(e) => updateLine(index, 'accountId', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white"
                              >
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>
                                    {acc.accountCode} - {acc.accountName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={line.description}
                                onChange={(e) => updateLine(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white"
                                placeholder="Line description..."
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.debit || ''}
                                onChange={(e) => updateLine(index, 'debit', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white text-right"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.credit || ''}
                                onChange={(e) => updateLine(index, 'credit', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white text-right"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(index)}
                                disabled={lines.length <= 2}
                                className="text-slate-400 hover:text-red-500 disabled:opacity-50 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={2} className="px-4 py-3 text-right text-slate-700">Totals:</td>
                          <td className={`px-4 py-3 text-right ${totalDebit !== totalCredit ? 'text-red-600' : 'text-slate-800'}`}>
                            {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`px-4 py-3 text-right ${totalDebit !== totalCredit ? 'text-red-600' : 'text-slate-800'}`}>
                            {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="journal-form"
                disabled={loading || Math.abs(totalDebit - totalCredit) > 0.001 || totalDebit === 0}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving..." : "Save Journal Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
