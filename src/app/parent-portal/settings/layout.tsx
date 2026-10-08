import React from 'react';
import { SettingsSubNav } from './SettingsSubNav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <SettingsSubNav />
      
      <div className="p-4 max-w-2xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

