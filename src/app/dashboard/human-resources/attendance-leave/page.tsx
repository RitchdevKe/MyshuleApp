import { redirect } from 'next/navigation';

export default function AttendanceLeavePage() {
  redirect('/dashboard/human-resources/attendance-leave/attendance');
}
