"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome to Digital Archive
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          A modern platform for storing and displaying your digital content
        </p>
        {isInvalidUser && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Your session is invalid. Please register or sign in with valid credentials.
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {effectiveSession ? (
            <>
              <Link
                href="/archive"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Browse Archive
              </Link>
              {effectiveSession.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </main>
  );
} 