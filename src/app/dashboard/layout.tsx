import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CommandPalette from "@/components/layout/CommandPalette";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SchoolLevelProvider } from "@/contexts/SchoolLevelContext";
import { getTenantProfile } from "@/app/actions/tenant";
import { getSession } from "@/lib/auth";
import { getCurrentUserProfile } from "@/app/actions/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getTenantProfile();
  const session = await getSession();
  const userProfile = await getCurrentUserProfile();
  
  return (
    <SchoolLevelProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen min-h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
          <Header tenantName={profile?.name} logoUrl={profile?.logoUrl} />
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar 
              tenantName={profile?.name} 
              logoUrl={profile?.logoUrl} 
              role={session?.roleName}
              userName={userProfile?.name}
              userEmail={userProfile?.email}
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300">
              {children}
            </main>
          </div>
          <CommandPalette />
        </div>
      </SidebarProvider>
    </SchoolLevelProvider>
  );
}
