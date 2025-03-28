"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

const DraggableItem = ({ item, index, moveItem, onEdit, onDelete }: {
  item: HomeContent;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: HomeContent) => void;
  onDelete: (id: string) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTENT_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CONTENT_ITEM',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index === index) {
        return;
      }
      moveItem(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  const dragDropRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
  };

  return (
    <div
      ref={dragDropRef}
      className={`p-4 mb-4 bg-white rounded-lg shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold capitalize">{item.type}</span>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-gray-700">{item.content}</div>
    </div>
  );
};

export default function HomeContentEditor() {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<HomeContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<HomeContent | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<HomeContent>>({
    type: 'paragraph',
    content: '',
  });

  useEffect(() => {
    if (!session?.user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchContent();
  }, [session, router]);

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

  const moveItem = async (dragIndex: number, hoverIndex: number) => {
    const newContent = [...content];
    const [draggedItem] = newContent.splice(dragIndex, 1);
    newContent.splice(hoverIndex, 0, draggedItem);
    setContent(newContent);

    // Update order in the database
    await Promise.all(
      newContent.map((item, index) =>
        fetch('/api/home-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, order: index }),
        })
      )
    );
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/home-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          order: content.length,
        }),
      });
      const data = await response.json();
      setContent([...content, data]);
      setShowAddForm(false);
      setNewItem({ type: 'paragraph', content: '' });
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleEdit = async (item: HomeContent) => {
    try {
      const response = await fetch('/api/home-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      setContent(content.map((c) => (c.id === data.id ? data : c)));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/home-content?id=${id}`, {
        method: 'DELETE',
      });
      setContent(content.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Homepage Content Editor</h1>
      
      <button
        onClick={() => setShowAddForm(true)}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add New Content
      </button>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Add New Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as HomeContent['type'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="button">Button</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <input
                type="text"
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DndProvider backend={HTML5Backend}>
        <div className="space-y-4">
          {content.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              onEdit={setEditingItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndProvider>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as HomeContent['type'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="heading">Heading</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="button">Button</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <input
                  type="text"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(editingItem)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 