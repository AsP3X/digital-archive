"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "../components/layouts/AdminLayout";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.isAdmin) {
      router.push("/");
    }
  }, [session, router]);

  if (!session?.user?.isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Welcome to the admin dashboard. More features will be added soon.
        </p>
      </div>
    </AdminLayout>
  );
} 