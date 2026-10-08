"use client";

import React, { useState } from "react";
import { RefreshCcw, Search, Filter, ScanLine, Clock, AlertCircle, CheckCircle2, MoreHorizontal, BookOpen } from "lucide-react";
import { checkoutBook, checkinBook } from "./actions";
import { useRouter } from "next/navigation";

export default function CirculationClient({ initialCirculations, books, members }: any) {
  const [circulations, setCirculations] = useState(initialCirculations);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!selectedBook || !selectedMember || !dueDate) {
        throw new Error("Please fill in all fields");
      }
      await checkoutBook({
        bookId: selectedBook,
        memberId: selectedMember,
        dueDate: new Date(dueDate),
      });
      setIsCheckoutModalOpen(false);
      setSelectedBook("");
      setSelectedMember("");
      setDueDate("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckin = async (circulationId: string) => {
    try {
      await checkinBook(circulationId);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to check in");
    }
  };

  const checkedOutCount = initialCirculations.filter((c: any) => c.status === "ISSUED").length;
  const overdueCount = initialCirculations.filter((c: any) => c.status === "OVERDUE").length;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Currently Checked Out</p>
            <h3 className="text-2xl font-black text-slate-800">{checkedOutCount}</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overdue Items</p>
            <h3 className="text-2xl font-black text-slate-800">{overdueCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Book Circulation</h2>
                 <p className="text-sm font-medium text-slate-500">Track check-outs, returns, and overdue library items.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
              >
                 <ScanLine className="w-4 h-4" />
                 Check Out
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Book, Member, or ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>ISSUED</option>
                 <option>OVERDUE</option>
                 <option>RETURNED</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Book & ID</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {initialCirculations.map((circ: any) => (
                   <tr key={circ.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{circ.book?.title || "Unknown Book"}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{circ.id.slice(0, 8)}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{circ.member?.student?.firstName} {circ.member?.student?.lastName}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="text-xs space-y-1">
                           <div className="flex justify-between w-40">
                              <span className="text-slate-500">Out:</span>
                              <span className="font-medium text-slate-700">{new Date(circ.issueDate).toLocaleDateString()}</span>
                           </div>
                           <div className="flex justify-between w-40">
                              <span className="text-slate-500">Due:</span>
                              <span className={`font-bold ${circ.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-700'}`}>{new Date(circ.dueDate).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            circ.status === 'ISSUED' ? 'bg-blue-50 text-blue-600' : 
                            circ.status === 'OVERDUE' ? 'bg-rose-50 text-rose-600' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {circ.status === 'ISSUED' && <Clock className="w-3.5 h-3.5" />}
                            {circ.status === 'OVERDUE' && <AlertCircle className="w-3.5 h-3.5" />}
                            {circ.status === 'RETURNED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {circ.status}
                          </span>
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        {(circ.status === 'ISSUED' || circ.status === 'OVERDUE') && (
                          <button 
                            onClick={() => handleCheckin(circ.id)}
                            className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Check In
                          </button>
                        )}
                     </td>
                   </tr>
                 ))}
                 {initialCirculations.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                       No circulations found.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-800 mb-4">Check Out Book</h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">{error}</div>}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Book</label>
                <select 
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                >
                  <option value="">Select a book...</option>
                  {books.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.title} (Available)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Member (Student)</label>
                <select 
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                >
                  <option value="">Select a member...</option>
                  {members.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.student?.firstName} {m.student?.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Due Date</label>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-70"
                >
                  {isLoading ? "Checking out..." : "Check Out"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
