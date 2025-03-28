"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface HomeContent {
  id: string;
  type: 'heading' | 'paragraph' | 'button';
  content: string;
  order: number;
  style?: {
    color?: string;
    fontSize?: string;
    backgroundColor?: string;
  };
}

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
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          {item.type === 'button' && (
            <Link
              href={session ? '/archive' : '/auth/login'}
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              {item.content}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
} 