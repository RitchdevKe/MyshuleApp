import prisma from '@/lib/prisma';
import ParticipationClient from './ParticipationClient';

export default async function ParticipationPage() {
  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      admissionNumber: true,
      status: true,
    },
    take: 50,
  });

  const staff = await prisma.staff.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      employeeNumber: true,
      department: true,
    },
    take: 50,
  });

  return (
    <ParticipationClient 
      dbStudents={students} 
      dbStaff={staff} 
    />
  );
}
