"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Nav() {
  const { data: session } = useSession();
  const router = useRouter();

  console.log("Nav component session:", session?.user);

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: "/"
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Digital Archive
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/archive"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Archive
                </Link>
                <Link
                  href="/contact"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Contact
                </Link>
                {session.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-sm hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 