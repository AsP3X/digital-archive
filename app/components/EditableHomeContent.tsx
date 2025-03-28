"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ArchivePreview from '@/components/ui/archive-preview';

interface PageElement {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'archive-grid';
  content: string;
}

interface Page {
  title: string;
  slug: string;
  content: PageElement[];
  isPublished: boolean;
}

const defaultContent: PageElement[] = [
  {
    id: 'default-heading',
    type: 'heading',
    content: 'Welcome to Digital Archive',
  },
  {
    id: 'default-paragraph',
    type: 'paragraph',
    content: 'Your personal space for storing and organizing digital memories.',
  },
  {
    id: 'default-archive-grid',
    type: 'archive-grid',
    content: 'Recent Archives',
  },
];

export default function EditableHomeContent() {
  const { data: session } = useSession();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/pages/home');
      if (!response.ok) throw new Error('Failed to fetch home page');
      const data = await response.json();
      setPage(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      // If there's an error, create a default page structure
      setPage({
        title: 'Home',
        slug: 'home',
        content: defaultContent,
        isPublished: true,
      });
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

  if (!page) {
    return null;
  }

  return (
    <div className="max-w-4xl w-full text-center">
      {page.content.map((element) => (
        <div
          key={element.id}
          className="mb-6"
        >
          {element.type === 'heading' && (
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {element.content}
            </h1>
          )}
          {element.type === 'paragraph' && (
            <p className="text-xl text-gray-600">
              {element.content}
            </p>
          )}
          {element.type === 'archive-grid' && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">{element.content}</h2>
              <ArchivePreview />
            </div>
          )}
          {element.type === 'image' && (
            <img
              src={element.content}
              alt=""
              className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
} 