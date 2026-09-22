"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  FileText,
  BarChart,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  {
    title: "New Search",
    href: "/",
    icon: Search,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Results",
    href: "/results",
    icon: FileText,
  },
  {
    title: "Stats",
    href: "/stats",
    icon: BarChart,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function CustomerSidebar({ className, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "w-64 bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 overflow-y-auto",
        className,
      )}
    >
      <div className="p-4 space-y-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Menu
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-blue-600",
                  pathname === item.href ||
                    (item.title == "Jobs" && pathname.includes("/job"))
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm ring-1 ring-blue-300/30 font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    pathname === item.href ? "text-white" : undefined,
                  )}
                />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
