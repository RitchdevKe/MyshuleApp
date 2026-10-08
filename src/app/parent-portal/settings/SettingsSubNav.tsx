"use client";

import React from 'react';
import { User, LayoutGrid, Shield, Headphones } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsSubNav() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Update Profile", href: "/parent-portal/settings/profile", icon: User },
    { label: "Accounts", href: "/parent-portal/settings/accounts", icon: LayoutGrid },
    { label: "Change Password", href: "/parent-portal/settings/password", icon: Shield },
    { label: "Customer Support", href: "/parent-portal/settings/support", icon: Headphones },
  ];

  return (
    <div className="bg-primary-700 w-full flex overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex-1 min-w-[80px] flex flex-col items-center justify-center py-2 px-1 transition-colors ${
              isActive ? 'bg-green-900 text-white' : 'text-primary-100 hover:bg-primary-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium tracking-wide text-center leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

