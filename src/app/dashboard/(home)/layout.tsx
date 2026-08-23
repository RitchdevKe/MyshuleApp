"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const tabs = [
    { name: "Overview", href: "/dashboard" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Activities", href: "/dashboard/activities" }
  ];

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
        <button className="bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md flex items-center gap-2 w-fit shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
          Generate Report
        </button>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
