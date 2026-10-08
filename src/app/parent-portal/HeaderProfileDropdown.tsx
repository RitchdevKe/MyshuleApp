"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LayoutGrid, Key, Headphones, FileText, Shield, LogOut, Users } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function HeaderProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow active:scale-95"
      >
        <User className="w-5 h-5 text-slate-500 dark:text-slate-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
          
          <Link href="/parent-portal/account" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsOpen(false)}>
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Profile</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsOpen(false)}>
            <Users className="w-4 h-4 text-primary-600 dark:text-primary-500" />
            <span className="text-primary-600 dark:text-primary-500 text-sm font-medium">Switch Student</span>
          </button>

          <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

          <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsOpen(false)}>
            <Key className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Change Password</span>
          </Link>

          <Link href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsOpen(false)}>
            <Headphones className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Customer Support</span>
          </Link>

          <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 group transition-colors text-left">
            <LogOut className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-red-600 dark:text-red-400 text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

