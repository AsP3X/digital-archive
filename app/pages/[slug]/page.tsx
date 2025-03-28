import React from 'react';
import { notFound } from 'next/navigation';
import PageEditor from '@/app/components/PageEditor';
import prisma from '@/lib/prisma';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function EditPage({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 px-6">Edit Page</h1>
      <PageEditor initialPage={page} />
    </div>
  );
} 