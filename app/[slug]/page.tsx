import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: {
      slug: params.slug,
      isPublished: true,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <div className="space-y-6">
        {page.content.map((element: any) => {
          switch (element.type) {
            case 'heading':
              return (
                <h2 key={element.id} className="text-2xl font-semibold">
                  {element.content}
                </h2>
              );
            case 'paragraph':
              return (
                <p key={element.id} className="text-gray-700">
                  {element.content}
                </p>
              );
            case 'image':
              return (
                <img
                  key={element.id}
                  src={element.content}
                  alt=""
                  className="max-w-full h-auto rounded"
                />
              );
            case 'archive-grid':
              return (
                <div key={element.id} className="grid grid-cols-3 gap-4">
                  {/* Archive grid content will be added later */}
                  <div className="text-gray-500 italic">
                    Archive Grid (coming soon)
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
} 