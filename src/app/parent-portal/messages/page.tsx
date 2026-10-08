import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import prisma from "@/lib/prisma";
import { getParentPortalData } from '../data';
import ActiveStudentHeader from '../components/ActiveStudentHeader';
import MessagesClient from './MessagesClient';

export default async function MessagesPage() {
  const { parent, activeStudent } = await getParentPortalData();

  if (!parent) {
    return <div className="p-4 text-center">Parent profile not found.</div>;
  }

  const activeEnrollment = activeStudent?.enrollments?.[0];

  const announcements = await prisma.announcement.findMany({
    where: {
      tenantId: parent.tenantId,
      OR: [
        { targetAudience: 'ALL' },
        { targetAudience: 'PARENTS' },
        ...(activeEnrollment?.classId ? [{
          targetAudience: 'STUDENTS' as const,
          targetClassId: activeEnrollment.classId,
        }] : []),
      ]
    },
    include: {
      createdBy: {
        include: {
          staff: true
        }
      }
    },
    orderBy: {
      publishDate: 'desc'
    }
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      <div className="shrink-0">
        <ActiveStudentHeader />
      </div>

      <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
        <Link href="?tab=messages" className="flex-1 text-center py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-sm font-bold text-primary-700 dark:text-primary-400">
          Messages
        </Link>
        <Link href="?tab=notifications" className="flex-1 text-center py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
          Notifications
        </Link>
        <Link href="?tab=newsletters" className="flex-1 text-center py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
          Newsletters
        </Link>
      </div>

      <div className="shrink-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200/50 dark:border-orange-800/50 rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
           <ShieldAlert className="w-4 h-4 text-orange-500" />
           <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">SMS Opt-Out Preferences</span>
        </div>
        <Link href="/parent-portal/settings/notifications" className="bg-white dark:bg-slate-800 hover:bg-orange-50 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm border border-orange-100 dark:border-orange-900/50">
          Manage
        </Link>
      </div>

      <div className="flex-1 min-h-0 relative">
        <MessagesClient announcements={announcements} />
      </div>
    </div>
  );
}

