import { redirect } from 'next/navigation';
export default function Page() {
  redirect('/dashboard/finance/payments-receipts/collections');
}