'use client';

import { useEffect, useState } from 'react';
import PageEditor from '@/app/components/PageEditor';

interface Page {
  title: string;
  slug: string;
  content: Array<{
    id: string;
    type: 'heading' | 'paragraph' | 'image' | 'archive-grid';
    content: string;
  }>;
  isPublished: boolean;
}

export default function HomePageEditor() {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const response = await fetch('/api/pages/home');
      if (!response.ok) {
        throw new Error('Failed to fetch home page');
      }
      const data = await response.json();
      setPage(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
        </div>
      </div>
    );
  }

  return <PageEditor initialPage={page || undefined} />;
} 