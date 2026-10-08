'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, CheckCircle2, ArrowRight, FileText, CreditCard, X, Building, Loader2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Term {
  name: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  amountPaid: number;
  academicTerm?: Term | null;
}

interface Payment {
  id: string;
  receiptNumber: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  status: string;
}

interface FeesClientComponentProps {
  invoices: Invoice[];
  payments: Payment[];
}

export default function FeesClientComponent({ invoices, payments }: FeesClientComponentProps) {
  const [activeTab, setActiveTab] = useState<'current-due' | 'transaction-history'>('current-due');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const availableTerms = [...new Set(invoices.map(inv => inv.academicTerm?.name).filter(Boolean))] as string[];
  const currentTerm = selectedTerm || availableTerms[0] || '';

  const filteredInvoices = invoices.filter(inv => inv.academicTerm?.name === currentTerm);

  const handlePay = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentSuccess(false);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setSelectedInvoice(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative">
        <button 
          onClick={() => setActiveTab('current-due')}
          className={`flex-1 text-center py-2.5 rounded-xl shadow-sm text-sm font-bold transition-all ${activeTab === 'current-due' ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Current Due
        </button>
        <button 
          onClick={() => setActiveTab('transaction-history')}
          className={`flex-1 text-center py-2.5 rounded-xl shadow-sm text-sm font-bold transition-all ${activeTab === 'transaction-history' ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
        >
          Transaction History
        </button>
      </div>

      {activeTab === 'current-due' && (
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl">Financial Overview</h3>
          </div>

          <div className="relative mb-6 group">
            <select 
              value={currentTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 pr-10 text-slate-700 dark:text-slate-200 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all cursor-pointer group-hover:border-primary-300 dark:group-hover:border-primary-700"
            >
              {availableTerms.length > 0 ? (
                availableTerms.map((termName, i) => (
                  <option key={i} value={termName}>{termName}</option>
                ))
              ) : (
                <option>No Terms Available</option>
              )}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
          </div>

          <div className="flex flex-col gap-4">
            {filteredInvoices.length === 0 ? (
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center text-slate-500 border border-slate-200/50">
                <CheckCircle2 className="w-12 h-12 text-primary-500 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No outstanding invoices found.</p>
              </div>
            ) : (
              filteredInvoices.map((invoice, index) => {
                const total = Number(invoice.totalAmount);
                const paid = Number(invoice.amountPaid);
                const balance = total - paid;
                const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
                const isFullyPaid = balance <= 0;
                const radius = 28;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

                return (
                  <div key={invoice.id} className="bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                            <circle 
                              cx="32" cy="32" r={radius}
                              className="fill-none stroke-slate-100 dark:stroke-slate-700"
                              strokeWidth="6"
                            />
                            <circle 
                              cx="32" cy="32" r={radius}
                              className={`fill-none transition-all duration-1000 ease-out ${isFullyPaid ? 'stroke-primary-500' : 'stroke-orange-500'}`}
                              strokeWidth="6"
                              strokeLinecap="round"
                              style={{ 
                                strokeDasharray: circumference, 
                                strokeDashoffset: strokeDashoffset 
                              }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            {isFullyPaid ? (
                              <CheckCircle2 className="w-6 h-6 text-primary-500" />
                            ) : (
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{Math.min(percentage, 100)}%</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2 text-lg">
                            Invoice {invoice.invoiceNumber && `#${invoice.invoiceNumber}`}
                          </h4>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {isFullyPaid ? (
                         <span className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-black border border-primary-100 dark:border-primary-800">Settled</span>
                      ) : (
                        <button 
                          onClick={() => handlePay(invoice)}
                          className="text-xs font-black uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95"
                        >
                          Pay Now <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
                        <p className="font-black text-slate-700 dark:text-slate-300 text-base tabular-nums">
                          Ksh {paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                        <p className={`font-black text-xl tabular-nums ${isFullyPaid ? 'text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                          Ksh {Math.max(balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === 'transaction-history' && (
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl mb-6">Recent Payments</h3>
           <div className="flex flex-col gap-3">
             {payments.length === 0 ? (
               <div className="bg-white/50 dark:bg-slate-800/50 rounded-3xl p-8 text-center text-slate-500 border border-slate-200/50">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="font-medium">No transactions found.</p>
               </div>
             ) : (
               payments.map(payment => (
                 <div key={payment.id} className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                       <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                     </div>
                     <div>
                       <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{payment.receiptNumber}</p>
                       <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                         {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                       </p>
                     </div>
                   </div>
                   <div className="text-right shrink-0">
                     <p className="font-black text-slate-800 dark:text-slate-100">
                       Ksh {Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </p>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full inline-block mt-1">
                       {payment.status}
                     </span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </section>
      )}

      {/* Payment Gateway Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {paymentSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Your payment for Invoice #{selectedInvoice.invoiceNumber} has been processed.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">Secure Checkout</span>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Amount Due</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                      Ksh {Math.max(Number(selectedInvoice.totalAmount) - Number(selectedInvoice.amountPaid), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white font-black text-[10px]">MPESA</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">M-Pesa</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-4 border-primary-500 bg-white dark:bg-slate-900"></div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Card</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                    </button>
                  </div>

                  <button 
                    onClick={simulatePayment}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 dark:bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
