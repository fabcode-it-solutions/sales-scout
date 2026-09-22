"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Loader2, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';

// Simple Badge component inline
function StatusBadge({ status }) {
  const styles = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    waiting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  };

  const icons = {
    completed: <CheckCircle className="w-3 h-3 mr-1" />,
    failed: <XCircle className="w-3 h-3 mr-1" />,
    processing: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
    waiting: <Clock className="w-3 h-3 mr-1" />,
    active: <Loader2 className="w-3 h-3 mr-1 animate-spin" />
  };

  const normalizedStatus = status?.toLowerCase() || 'waiting';

  return (
    <span className={`uppercase inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[normalizedStatus] || styles.waiting}`}>
      {icons[normalizedStatus]}
      {status}
    </span>
  );
}

export default function JobStatus({ jobs }) {
  const [statuses, setStatuses] = useState({});
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    if (!jobs.length) return;

    const fetchStatuses = async () => {
      const updates = {};
      await Promise.all(jobs.map(async (job) => {
        // Skip if already completed or failed to save API calls
        if (statuses[job.id]?.status === 'completed' || statuses[job.id]?.status === 'failed') {
          updates[job.id] = statuses[job.id];
          return;
        }

        try {
          const res = await api.get(`/api/job/${job.id}`);
          if (res.data.success) {
            updates[job.id] = res.data.job;
          }
        } catch (err) {
          console.error(`Failed to fetch status for job ${job.id}`, err);
        }
      }));
      setStatuses(prev => ({ ...prev, ...updates }));
    };

    // Initial fetch
    fetchStatuses();

    // Poll every 3 seconds
    const interval = setInterval(fetchStatuses, 3000);
    return () => clearInterval(interval);
  }, [jobs]); // Re-run if jobs list changes, but we ideally merge statuses

  if (!jobs.length) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Processing Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const current = statuses[job.id] || job;
              return (
                <div key={job.id} className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium truncate text-sm flex-1">{current.url}</div>
                    <StatusBadge status={current.status} />
                  </div>
                  <div className="text-sm">
                    {current.result ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        {current.result.emailsFound?.length || 0} emails found
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No results yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const current = statuses[job.id] || job;
                  return (
                    <tr key={job.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium truncate max-w-[300px]">{current.url}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={current.status} />
                      </td>
                      <td className="px-4 py-3">
                        {current.result ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            {current.result.emailsFound?.length || 0} emails found
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
