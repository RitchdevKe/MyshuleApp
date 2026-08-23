import { redirect } from 'next/navigation';

export default function BillingPage() {
  redirect('/dashboard/administration/billing/overview');
}
