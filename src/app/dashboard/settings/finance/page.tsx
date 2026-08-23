import { redirect } from 'next/navigation';

export default function FinanceSettingsPage() {
  redirect('/dashboard/settings/finance/fee-structures');
}