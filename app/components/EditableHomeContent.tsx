"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ArchivePreview from '@/components/ui/archive-preview';

interface HomeContent {
  id: string;
  type: 'heading' | 'paragraph' | 'archive-grid';
  content: string;
  order: number;
  style?: {
    color?: string;
    fontSize?: string;
    backgroundColor?: string;
  };
}

const defaultContent: HomeContent[] = [
  {
    id: 'default-heading',
    type: 'heading',
    content: 'Welcome to Digital Archive',
    order: 1,
    style: {
      fontSize: '3rem',
      color: 'hsl(var(--primary))',
    },
  },
  {
    id: 'default-paragraph',
    type: 'paragraph',
    content: 'Your personal space for storing and organizing digital memories.',
    order: 2,
    style: {
      fontSize: '1.25rem',
      color: 'hsl(var(--muted-foreground))',
    },
  },
  {
    id: 'default-archive-grid',
    type: 'archive-grid',
    content: 'Recent Archives',
    order: 3,
  },
];

export default function EditableHomeContent() {
  const { data: session } = useSession();
  const [content, setContent] = useState<HomeContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/home-content');
      if (!response.ok) throw new Error('Failed to fetch home content');
      const data = await response.json();
      setContent(data.length > 0 ? data : defaultContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full text-center">
      {content.map((item) => (
        <div
          key={item.id}
          style={item.style}
          className="mb-6"
        >
          {item.type === 'heading' && (
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {item.content}
            </h1>
          )}
          {item.type === 'paragraph' && (
            <p className="text-xl text-gray-600">
              {item.content}
            </p>
          )}
          {item.type === 'archive-grid' && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">{item.content}</h2>
              <ArchivePreview />
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 