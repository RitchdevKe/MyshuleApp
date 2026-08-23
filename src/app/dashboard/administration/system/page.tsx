import { redirect } from 'next/navigation';

export default function SystemPage() {
  redirect('/dashboard/administration/system/organization');
}
