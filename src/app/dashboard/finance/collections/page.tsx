import { redirect } from 'next/navigation';

export default function CollectionsPage() {
  redirect('/dashboard/finance/collections/payments-receipts');
}
