"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                Digital Archive
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/archive"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
              >
                Archive
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{session.user?.name || session.user?.email}</span>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      {session.user?.isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/auth/logout"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Sign Out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/archive"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
            >
              Archive
            </Link>
            <Link
              href="/contact"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
            >
              Contact
            </Link>
            {session ? (
              <>
                {session.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/auth/logout"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-500"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 hover:border-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 