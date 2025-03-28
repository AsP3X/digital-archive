import React from 'react';
import PageEditor from '@/app/components/PageEditor';

export default function NewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 px-6">Create New Page</h1>
      <PageEditor isNew />
    </div>
  );
} 