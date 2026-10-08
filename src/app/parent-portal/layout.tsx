import React from "react";
import { getTenantProfile } from "@/app/actions/tenant";

import HeaderProfileDropdown from "./HeaderProfileDropdown";
import { DesktopSidebar, MobileNav } from "./components/PortalNavigation";
import CommandPalette from "./components/CommandPalette";
import SearchButton from "./components/SearchButton";

export default async function ParentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getTenantProfile();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a] font-sans">
      <header className="sticky top-0 bg-primary-900 dark:bg-primary-950 text-white shadow-sm border-b border-primary-500/20 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight uppercase">{profile?.name || "MYSHULE APP"}</div>
          <div className="flex items-center gap-4">
            <SearchButton />
            <HeaderProfileDropdown />
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full relative">
        <DesktopSidebar />

        <main className="flex-1 overflow-x-hidden pb-28 md:pb-8 bg-transparent">
          {children}
        </main>
      </div>

      <MobileNav />
      <CommandPalette />
    </div>
  );
}

