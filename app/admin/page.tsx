"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface ArchiveItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && !session.user.isAdmin) {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [usersResponse, itemsResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/items")
      ]);

      if (!usersResponse.ok || !itemsResponse.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const [usersData, itemsData] = await Promise.all([
        usersResponse.json(),
        itemsResponse.json()
      ]);

      setUsers(usersData);
      setItems(itemsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back, {session?.user?.name || "Admin"}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Items</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Admin Users</h3>
            <p className="text-2xl font-bold">{users.filter(user => user.isAdmin).length}</p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Users Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Link 
                href="/admin/users" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">{user.name || "N/A"}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {user.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Archive Items Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Archive Items</h2>
              <Link 
                href="/admin/archive" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Author</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="capitalize text-sm">{item.type}</span>
                        </td>
                        <td className="px-4 py-3">{item.user.name || item.user.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 