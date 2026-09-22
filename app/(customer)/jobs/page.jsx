import JobsList from '@/components/jobs/JobsList';

export const metadata = {
  title: 'Processing Jobs | SalesScout',
  description: 'View and manage your processing jobs',
};

export default function JobsPage() {
  return <JobsList />;
}
