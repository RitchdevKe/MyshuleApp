import prisma from '@/lib/prisma';
import InterviewsClient from './InterviewsClient';

export default async function InterviewsPage() {
  const tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">System Configuration Required</h2>
        <p className="text-slate-500 mt-2">No tenant found. Please configure the system before using the recruitment module.</p>
      </div>
    );
  }

  const interviews = await prisma.interview.findMany({
    where: { tenantId: tenant.id },
    include: {
      applicant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          jobOpening: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      },
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      }
    },
    orderBy: {
      scheduledDate: 'desc'
    }
  });

  const applicants = await prisma.applicant.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      jobOpening: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: {
      firstName: 'asc'
    }
  });

  const staff = await prisma.staff.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: {
      firstName: 'asc'
    }
  });

  return (
    <InterviewsClient 
      initialInterviews={interviews} 
      applicants={applicants} 
      staff={staff} 
    />
  );
}
