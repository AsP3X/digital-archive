"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewArchiveItemPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "text",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create item");
      }

      router.push("/archive");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Item</h1>
        {error && (
          <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Create new archive item">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="title-description"
              className="w-full rounded-md border border-input bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p id="title-description" className="text-sm text-muted-foreground mt-1">
              Enter a descriptive title for your archive item
            </p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              aria-describedby="description-description"
              className="w-full rounded-md border border-input bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p id="description-description" className="text-sm text-muted-foreground mt-1">
              Provide a brief description of the item (optional)
            </p>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="type-description"
              className="w-full rounded-md border border-input bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
            <p id="type-description" className="text-sm text-muted-foreground mt-1">
              Select the type of content you want to archive
            </p>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              {formData.type === "image" ? "Image URL" : "Content"}
            </label>
            {formData.type === "image" ? (
              <input
                type="url"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="content-description"
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border border-input bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby="content-description"
                rows={5}
                className="w-full rounded-md border border-input bg-white text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            <p id="content-description" className="text-sm text-muted-foreground mt-1">
              {formData.type === "image" 
                ? "Enter the URL of the image you want to archive"
                : "Enter the text content you want to archive"}
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
              aria-label="Cancel and go back"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-busy={loading}
              aria-label={loading ? "Creating item..." : "Create new archive item"}
            >
              {loading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 