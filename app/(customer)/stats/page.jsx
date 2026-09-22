import SystemStats from '@/components/dashboard/SystemStats';

export const metadata = {
  title: 'System Stats | SalesScout',
  description: 'View system statistics and queue status',
};

export default function StatsPage() {
  return <SystemStats />;
}
