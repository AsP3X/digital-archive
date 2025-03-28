"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ArchiveItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string;
  createdAt: string;
}

export default function ArchivePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchItems();
    }
  }, [status, router]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/archive");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Archive</h1>
        <Link
          href="/archive/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Add new archive item"
        >
          Add New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-lg text-muted-foreground">
            No items in the archive yet.
          </p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Archive items"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-md overflow-hidden"
              role="listitem"
            >
              {item.type === "image" ? (
                <img
                  src={item.content}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center p-4">
                  <p className="text-muted-foreground line-clamp-4">
                    {item.content}
                  </p>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.description && (
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <time 
                    dateTime={item.createdAt}
                    className="text-sm text-muted-foreground"
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </time>
                  <Link
                    href={`/archive/${item.id}`}
                    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
                    aria-label={`View details for ${item.title}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 