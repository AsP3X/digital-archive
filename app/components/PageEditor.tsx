import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';

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

interface PageEditorProps {
  initialPage?: Page;
  isNew?: boolean;
}

export default function PageEditor({ initialPage, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState<Page>(
    initialPage || {
      title: '',
      slug: '',
      content: [],
      isPublished: false,
    }
  );
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [page]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(page.content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPage({ ...page, content: items });
  };

  const addElement = (type: PageElement['type']) => {
    const newElement: PageElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
    };
    setPage({ ...page, content: [...page.content, newElement] });
  };

  const updateElement = (id: string, content: string) => {
    setPage({
      ...page,
      content: page.content.map((element) =>
        element.id === id ? { ...element, content } : element
      ),
    });
  };

  const removeElement = (id: string) => {
    setPage({
      ...page,
      content: page.content.filter((element) => element.id !== id),
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');

      if (!page.title || !page.slug) {
        setError('Title and slug are required');
        return;
      }

      const response = await fetch(
        isNew ? '/api/pages' : `/api/pages/${initialPage?.slug}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(page),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save page');
      }

      if (isNew) {
        router.push(`/pages/${page.slug}`);
      }

      setHasUnsavedChanges(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async () => {
    try {
      setError('');
      const response = await fetch(`/api/pages/${page.slug}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to toggle publish status');
      }

      const { isPublished } = await response.json();
      setPage({ ...page, isPublished });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 relative">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Page Title"
          value={page.title}
          onChange={(e) => setPage({ ...page, title: e.target.value })}
          className="w-full p-2 text-2xl font-bold border rounded mb-2"
        />
        <input
          type="text"
          placeholder="page-slug"
          value={page.slug}
          onChange={(e) => setPage({ ...page, slug: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={!isNew}
        />
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => addElement('heading')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Heading
        </button>
        <button
          onClick={() => addElement('paragraph')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Paragraph
        </button>
        <button
          onClick={() => addElement('image')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Image
        </button>
        <button
          onClick={() => addElement('archive-grid')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Archive Grid
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="elements">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {page.content.map((element, index) => (
                <Draggable
                  key={element.id}
                  draggableId={element.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 border rounded bg-white"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {element.type}
                        </span>
                        <button
                          onClick={() => removeElement(element.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      {element.type === 'archive-grid' ? (
                        <div className="text-gray-500 italic">
                          Archive Grid (automatically populated)
                        </div>
                      ) : (
                        <textarea
                          value={element.content}
                          onChange={(e) =>
                            updateElement(element.id, e.target.value)
                          }
                          className="w-full p-2 border rounded"
                          rows={element.type === 'heading' ? 1 : 4}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Floating save button */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {!isNew && (
          <button
            onClick={togglePublish}
            className={`px-6 py-3 ${
              page.isPublished
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg shadow-lg transition-all`}
          >
            {page.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg transition-all hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 ${
            hasUnsavedChanges ? 'animate-pulse' : ''
          }`}
        >
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>
    </div>
  );
} 