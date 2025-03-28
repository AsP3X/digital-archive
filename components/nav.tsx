"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 text-sm hover:text-primary transition-colors">
                    <UserCircle className="h-5 w-5" />
                    <span>{session.user?.name || session.user?.email}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {session.user?.isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Login
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