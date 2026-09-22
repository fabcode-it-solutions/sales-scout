'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import Pagination from '@/components/Pagination';

export default function ResultsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const isMobile = useIsMobile(1024);
  const router = useRouter();

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/results', { params: { page, limit } });
      setItems(data.results || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const handlePageChange = (page) => {
    load(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {loading ? (
                <div className="py-6 text-center text-muted-foreground">Loading...</div>
              ) : (
                items.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => router.push(`/job/${r.id}`)}
                    className="p-4 border rounded-lg bg-muted/50 space-y-2 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                       <span className="text-primary font-medium text-sm truncate max-w-[150px] block">{r.id}</span>
                       <span className="text-xs text-muted-foreground">
                         {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                       </span>
                    </div>
                    <div className="text-sm truncate font-medium">{r.url}</div>
                    <div className="text-sm text-muted-foreground">
                      Contact: {r.contact?.email ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">{r.contact.email}</span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">URL</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="px-4 py-6 text-center" colSpan={4}>Loading...</td></tr>
                  ) : (
                    items.map((r) => (
                      <tr 
                        key={r.id} 
                        onClick={() => router.push(`/job/${r.id}`)}
                        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3"><span className="text-primary font-mono text-xs hover:underline">{r.id.substring(0, 8)}...</span></td>
                        <td className="px-4 py-3 truncate max-w-[300px]" title={r.url}>{r.url}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-4 py-3">
                          {r.contact?.email ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{r.contact.email}</span>
                              <span className="text-xs text-muted-foreground capitalize">{r.contact.source || 'Unknown'}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No contact found</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-border">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
