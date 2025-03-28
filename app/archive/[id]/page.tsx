"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ArchiveItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string;
  createdAt: string;
}

export default function ArchiveItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [item, setItem] = useState<ArchiveItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchItem();
    }
  }, [status, router, params.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/archive/${params.id}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch item");
      }
      const data = await response.json();
      setItem(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch item");
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
          <Link
            href="/archive"
            className="text-primary hover:underline"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
          <Link
            href="/archive"
            className="text-primary hover:underline"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <Link
            href="/archive"
            className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1"
            aria-label="Back to archive list"
          >
            Back to Archive
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-md overflow-hidden" role="article">
          {item.type === "image" ? (
            <div className="relative aspect-video">
              <img
                src={item.content}
                alt={item.title}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="p-6 bg-muted">
              <div className="prose prose-sm max-w-none">
                {item.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <div className="p-6">
            {item.description && (
              <p className="text-muted-foreground mb-4" role="doc-subtitle">
                {item.description}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              Created on <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 