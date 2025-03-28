import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminPages() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/pages/editor"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Open Editor
          </Link>
          <Link
            href="/admin/pages/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Page
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {/* Homepage Card */}
        <div className="p-4 border rounded bg-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Homepage</h2>
            <p className="text-sm text-gray-500">/</p>
          </div>
          <Link
            href="/admin/pages/home"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Edit
          </Link>
        </div>

        {/* Custom Pages */}
        {pages.map((page) => (
          <div
            key={page.slug}
            className="p-4 border rounded bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{page.title}</h2>
              <p className="text-sm text-gray-500">/{page.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/pages/${page.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Edit
              </Link>
              <Link
                href={`/${page.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                View
              </Link>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No custom pages yet. Create your first page!
          </div>
        )}
      </div>
    </div>
  );
} 