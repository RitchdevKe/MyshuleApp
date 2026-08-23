import { redirect } from 'next/navigation';

export default function TransportPage() {
  redirect('/dashboard/operations/transport/vehicles');
}