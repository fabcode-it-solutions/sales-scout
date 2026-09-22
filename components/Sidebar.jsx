'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, FileText, Bell, Users, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Analytics',
    href: '/admin/stats',
    icon: BarChart3
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Activity',
    href: '/admin/activity',
    icon: Activity
  },
  {
    title: 'Logs',
    href: '/admin/logs',
    icon: FileText
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell
  }
];

export default function Sidebar({ className, onClose }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 overflow-y-auto", className)}>
      <div className="p-4 space-y-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Admin Panel
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
                  pathname === item.href 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm ring-1 ring-blue-300/30 font-semibold" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-white" : undefined)} />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            System
          </h2>
          <div className="space-y-1">
             <Link
                href="/jobs"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary transition-all"
              >
                <Settings className="h-4 w-4" />
                Queue Status
              </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
