"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface ArchiveItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string;
  createdAt: string;
}

export default function ArchivePreview() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchItems();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/archive?limit=3");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center space-y-4">
        <div className="text-lg text-muted-foreground">Sign in to view your archive items</div>
        <Link
          href="/auth/login"
          className="text-primary hover:underline font-medium"
        >
          Sign In →
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">No items available</div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {item.type === "image" ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.content}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ) : (
            <div className="h-48 bg-muted flex items-center justify-center p-4">
              <p className="text-muted-foreground line-clamp-4">
                {item.content}
              </p>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
              {item.title}
            </h2>
            {item.description && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <Link
                href={`/archive/${item.id}`}
                className="text-primary hover:underline text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 