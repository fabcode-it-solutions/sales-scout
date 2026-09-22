'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SystemStats() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    const res = await api.get('/api/stats');
    setData(res.data);
  };

  const clearQueue = async () => {
    if (!confirm('Are you sure you want to clear the entire queue? This cannot be undone.')) return;
    setClearing(true);
    try {
      await api.post('/api/queue/clear');
      await load();
    } catch (error) {
      console.error('Failed to clear queue', error);
      alert('Failed to clear queue: ' + (error.response?.data?.error || error.message));
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Stats</CardTitle>
          {user?.role === 'admin' && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearQueue}
              disabled={clearing}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {clearing ? 'Clearing...' : 'Clear Queue'}
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {data ? (
            <>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">Waiting</p>
                <p className="text-2xl font-semibold">{data.queue?.waiting ?? 0}</p>
              </div>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold">{data.queue?.active ?? 0}</p>
              </div>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold">{data.queue?.completed ?? 0}</p>
              </div>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-2xl font-semibold">{data.queue?.failed ?? 0}</p>
              </div>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{data.queue?.total ?? 0}</p>
              </div>
              <div className="p-4 rounded bg-muted/50">
                <p className="text-xs text-muted-foreground">DB Items</p>
                <p className="text-2xl font-semibold">{data.database?.status ?? 0}</p>
              </div>
            </>
          ) : (
            <div className="col-span-2 flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
