"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus } from "lucide-react";

interface PageComponent {
  id: string;
  name: string;
  type: string;
  config: any;
  order: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isPublished: boolean;
  components: PageComponent[];
}

export default function PageEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [params.id]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch page");
      }
      const data = await response.json();
      setPage(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch page");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        throw new Error("Failed to save page");
      }

      router.push("/admin/pages");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComponent = () => {
    if (!page) return;

    const newComponent: PageComponent = {
      id: `temp-${Date.now()}`,
      name: "New Component",
      type: "text",
      config: { content: "" },
      order: page.components.length,
    };

    setPage({
      ...page,
      components: [...page.components, newComponent],
    });
  };

  const handleUpdateComponent = (componentId: string, updates: Partial<PageComponent>) => {
    if (!page) return;

    setPage({
      ...page,
      components: page.components.map((component) =>
        component.id === componentId
          ? { ...component, ...updates }
          : component
      ),
    });
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!page) return;

    setPage({
      ...page,
      components: page.components.filter((component) => component.id !== componentId),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <button
          onClick={() => router.push("/admin/pages")}
          className="text-primary hover:underline"
        >
          Back to Pages
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{page.title}</h1>
            <p className="text-muted-foreground">/{page.slug}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setPage({ ...page, isPublished: !page.isPublished })}
              className={`px-4 py-2 rounded-md ${
                page.isPublished
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {page.isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {page.components.map((component) => (
            <div
              key={component.id}
              className="bg-card rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <input
                  type="text"
                  value={component.name}
                  onChange={(e) =>
                    handleUpdateComponent(component.id, { name: e.target.value })
                  }
                  className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
                />
                <button
                  onClick={() => handleDeleteComponent(component.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  Delete
                </button>
              </div>

              {component.type === "text" && (
                <textarea
                  value={component.config.content}
                  onChange={(e) =>
                    handleUpdateComponent(component.id, {
                      config: { ...component.config, content: e.target.value },
                    })
                  }
                  className="w-full h-32 p-2 border rounded-md"
                  placeholder="Enter text content..."
                />
              )}

              {/* Add more component type editors here */}
            </div>
          ))}

          <button
            onClick={handleAddComponent}
            className="w-full p-4 border-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Component</span>
          </button>
        </div>
      </div>
    </DndProvider>
  );
} 