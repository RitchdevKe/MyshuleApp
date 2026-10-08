import React from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import prisma from "@/lib/prisma";
import { NewBillButton } from "./NewBillButton";

export const dynamic = "force-dynamic";

export default async function AccountsPayablePage() {
  const tenant = await prisma.tenant.findFirst();
  
  let bills: any[] = [];
  let totalOutstanding = 0;
  let overdueAmount = 0;

  if (tenant) {
    bills = await prisma.purchaseOrder.findMany({
      where: { tenantId: tenant.id },
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });

    totalOutstanding = bills
      .filter((b) => b.status !== 'PAID')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    overdueAmount = bills
      .filter((b) => b.status === 'OVERDUE')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount).replace('KES', 'KSh');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
            <p className="text-3xl font-black text-slate-800">{formatCurrency(totalOutstanding)}</p>
         </div>
         <div className="bg-rose-50/80 backdrop-blur-md p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Overdue Bills</p>
            <p className="text-3xl font-black text-rose-700">{formatCurrency(overdueAmount)}</p>
         </div>
         <div className="h-full">
            <NewBillButton />
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-80">
               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search vendors or bill refs..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
               />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
               <Filter className="w-4 h-4 text-slate-400" />
               Filter Status
            </button>
         </div>
         
         <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-primary-900 text-[11px] uppercase tracking-wider text-white font-black">
                     <th className="p-4 pl-6">Vendor</th>
                     <th className="p-4">Bill Ref</th>
                     <th className="p-4">Due Date</th>
                     <th className="p-4 text-right">Amount</th>
                     <th className="p-4 text-center">Status</th>
                     <th className="p-4 text-right"></th>
                  </tr>
               </thead>
               <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No bills found. Click "Record New Bill" to add one.
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill) => {
                      const isOverdue = bill.status === 'OVERDUE';
                      const isOpen = bill.status === 'OPEN';
                      return (
                        <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                           <td className="p-4 pl-6 font-bold text-slate-800">{bill.supplier?.name || 'Unknown'}</td>
                           <td className="p-4 text-slate-500">{bill.poNumber}</td>
                           <td className={`p-4 font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                             {bill.deliveryDate ? new Date(bill.deliveryDate).toLocaleDateString() : 'N/A'}
                           </td>
                           <td className="p-4 text-right font-black text-slate-800">{formatCurrency(bill.totalAmount)}</td>
                           <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                                 isOverdue ? 'bg-rose-50 text-rose-700' : 
                                 isOpen ? 'bg-amber-50 text-amber-700' :
                                 'bg-green-50 text-green-700'
                              }`}>
                                 {bill.status}
                              </span>
                           </td>
                           <td className="p-4 text-right">
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                 <MoreHorizontal className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                      );
                    })
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
