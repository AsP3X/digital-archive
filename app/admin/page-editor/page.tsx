"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PageEditor } from "@/components/page-editor";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
}

interface Session {
  user?: User;
}

export default function AdminPageEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Page Editor</h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Admin Dashboard
        </button>
      </div>
      <PageEditor />
    </div>
  );
} 