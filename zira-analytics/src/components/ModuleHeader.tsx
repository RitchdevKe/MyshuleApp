import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  Menu,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface ModuleHeaderProps {
  teacherInfo: { name: string; email: string; role: string };
  activeSchoolName: string;
  onToggleSidebar?: () => void;
  activeModule?: string;
}

export function ModuleHeader({ teacherInfo, activeSchoolName, onToggleSidebar, activeModule = 'System Workspace' }: ModuleHeaderProps) {
  const { currency, setCurrency } = useCurrency();

  const breadcrumbParts = activeModule.split('-').map(p => p.trim());

  const getGreeting = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(formatter.format(new Date()), 10);
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const currentDate = `${day}/${month}/${year}`;

  const firstName = teacherInfo?.name ? teacherInfo.name.split(' ')[0] : 'Educator';
  const userInitials = teacherInfo?.name ? teacherInfo.name.substring(0, 2).toUpperCase() : 'ZI';

  const handleActionToast = (message: string) => {
    toast.success(message, {
      style: {
        background: 'var(--color-header-bg)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        fontWeight: '500',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      }
    });
  };

  return (
    <header className="w-full bg-[#3D1D3F] text-white border-b-4 border-[#C20F47] shadow-lg shrink-0 select-none z-30 relative">
      {/* Subtle accent glow */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />

      <div className="w-full py-3 px-5 flex items-center justify-between relative z-10 gap-4">
        
        {/* Left: Toggle + Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Sidebar Toggle */}
          <button 
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white cursor-pointer flex items-center justify-center border border-white/10 active:scale-95 shrink-0"
            title="Toggle Sidebar Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Logo Medallion */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow border-2 border-[#C20F47] shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3D1D3F] to-[#C20F47] flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Brand + Breadcrumb */}
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-white leading-tight">
              My Shule App
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-white/50 font-medium truncate max-w-[120px] sm:max-w-none">
                {activeSchoolName}
              </span>
              {breadcrumbParts.length > 0 && (
                <>
                  {breadcrumbParts.map((part, i) => (
                    <React.Fragment key={i}>
                      <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                      <span className={`text-xs font-medium truncate ${i === breadcrumbParts.length - 1 ? 'text-amber-300/80' : 'text-white/50'}`}>
                        {part}
                      </span>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Date, Currency, Notifications, Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Date pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wide">Date</span>
            <span className="text-xs font-medium text-white/90">{currentDate}</span>
          </div>

          {/* Currency selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full px-3 py-1.5 transition-colors">
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wide">Cur</span>
            <select 
              value={currency} 
              onChange={(e) => {
                setCurrency(e.target.value);
                handleActionToast(`Currency set to ${e.target.value}`);
              }}
              className="bg-transparent text-white font-medium rounded cursor-pointer focus:ring-0 focus:outline-none text-xs"
            >
              <option value="KES" className="bg-slate-900 text-white">KES</option>
              <option value="USD" className="bg-slate-900 text-white">USD</option>
              <option value="GBP" className="bg-slate-900 text-white">GBP</option>
            </select>
          </div>

          {/* Bell */}
          <button 
            type="button"
            onClick={() => handleActionToast("Opening system notifications...")}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-white/80 hover:text-white relative cursor-pointer active:scale-95"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C20F47] rounded-full border border-[#3D1D3F]" />
          </button>

          {/* Avatar */}
          <button 
            type="button"
            onClick={() => handleActionToast(`${teacherInfo?.name} · ${teacherInfo?.role}`)}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow border-2 border-[#C20F47] shrink-0 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
            title="User Account"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C20F47] to-[#3D1D3F] flex items-center justify-center font-semibold text-xs text-white">
              {userInitials}
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
