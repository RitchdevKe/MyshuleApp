"use client";

import React from 'react';
import { BarChart2, User, Rss, Mail, List } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AccountSubNav() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Analysis", href: "#", icon: BarChart2 },
    { label: "Profile", href: "/parent-portal/account", icon: User },
    { label: "Diary", href: "#", icon: Rss },
    { label: "Inbox", href: "#", icon: Mail },
    { label: "More", href: "#", icon: List },
  ];

  return (
    <div className="bg-primary-500 w-full flex">
      {navItems.map((item) => {
        const isActive = item.href === pathname;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
              isActive ? 'bg-green-800 text-white' : 'text-primary-50 hover:bg-primary-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

