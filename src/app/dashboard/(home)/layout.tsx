"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reportDialogRef = useRef<HTMLDialogElement>(null);
  
  const tabs = [
    { name: "Overview", href: "/dashboard" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Activities", href: "/dashboard/activities" }
  ];

  const handlePrint = () => {
    reportDialogRef.current?.close();
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Pill-style Navigation at the very top of the dashboard pages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="overflow-x-auto">
          <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              // Precise active logic since /dashboard is the base for everything
              const isActive = tab.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(tab.href);
                
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`
                    whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors shadow-sm
                    ${isActive 
                      ? 'bg-secondary-500 text-white shadow-md' 
                      : 'bg-primary-900 text-white hover:bg-primary-800'
                    }
                  `}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <button 
          onClick={() => reportDialogRef.current?.showModal()}
          className="bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 w-fit shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
          Generate Report
        </button>
      </div>

      <div className="mt-6">
        {children}
      </div>

      {/* Generate Report Modal */}
      <dialog 
        ref={reportDialogRef} 
        className="backdrop:bg-slate-900/50 p-6 rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md bg-white/80 backdrop-blur-xl open:animate-in open:fade-in-90 open:zoom-in-95"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800">Generate Report</h2>
          <button 
            onClick={() => reportDialogRef.current?.close()}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p className="text-slate-600 mb-6 text-sm font-medium">
          Choose the format you would like to export this dashboard overview in. It will include all visible metrics and graphs.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handlePrint}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Save as PDF / Print
          </button>
          <button 
            onClick={() => reportDialogRef.current?.close()}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors shadow-sm border border-slate-200 flex items-center justify-center gap-2"
          >
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
}
