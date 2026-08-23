import { redirect } from 'next/navigation';

export default function FinancialReportsPage() {
  redirect('/dashboard/finance/financial-reports/income-statement');
}