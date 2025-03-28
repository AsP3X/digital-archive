"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 h-12">
          <Link
            href="/admin"
            className={`text-sm font-medium transition-colors ${
              isActive("/admin")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={`text-sm font-medium transition-colors ${
              isActive("/admin/users")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Users
          </Link>
          <Link
            href="/admin/settings"
            className={`text-sm font-medium transition-colors ${
              isActive("/admin/settings")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
} 