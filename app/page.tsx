"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Digital Archive
        </h1>
        <p className="text-center mb-8">
          A modern platform for storing and displaying your digital content
        </p>
        <div className="flex justify-center gap-4">
          {session ? (
            <>
              <Link
                href="/archive"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Browse Archive
              </Link>
              {session.user?.isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </main>
  );
} 