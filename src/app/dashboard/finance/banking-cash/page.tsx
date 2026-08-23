import { redirect } from 'next/navigation';

export default function BankingCashPage() {
  redirect('/dashboard/finance/banking-cash/bank-accounts');
}