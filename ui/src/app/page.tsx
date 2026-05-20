import { redirect } from 'next/navigation';

// Root page redirects to /leads (or /login if not authenticated — handled by layout)
export default function RootPage() {
  redirect('/leads');
}
