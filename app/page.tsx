"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditableHomeContent from "./components/EditableHomeContent";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isInvalidUser, setIsInvalidUser] = useState(false);

  useEffect(() => {
    // Check if the session exists but user is not properly registered
    if (status === "authenticated" && session?.user) {
      // Verify if the user is valid by making a request to the API
      fetch("/api/auth/verify-user")
        .then(response => {
          if (!response.ok) {
            setIsInvalidUser(true);
            // Clear the session using NextAuth's signOut
            signOut({ redirect: true, callbackUrl: "/" });
          }
        })
        .catch(() => {
          setIsInvalidUser(true);
        });
    }
  }, [status, session]);

  // If the user is invalid, treat them as unregistered
  const effectiveSession = isInvalidUser ? null : session;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <EditableHomeContent />
      {isInvalidUser && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Your session is invalid. Please register or sign in with valid credentials.
          </p>
        </div>
      )}
    </main>
  );
} 