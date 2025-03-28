'use client';

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from "@/components/ui/card";

interface ComponentItem {
  id: string;
  type: string;
  content: string;
}

const availableComponents = [
  { id: "text", type: "text", content: "Text Block" },
  { id: "image", type: "image", content: "Image Block" },
  { id: "heading", type: "heading", content: "Heading Block" },
  { id: "list", type: "list", content: "List Block" },
  { id: "button", type: "button", content: "Button Block" },
  { id: "divider", type: "divider", content: "Divider Block" },
  { id: "spacer", type: "spacer", content: "Spacer Block" },
  { id: "video", type: "video", content: "Video Block" },
];

const DraggableComponent: React.FC<{ component: ComponentItem }> = ({ component }) => {
  const dragRef = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<ComponentItem, unknown, { isDragging: boolean }>(() => ({
    type: "COMPONENT",
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`p-4 mb-2 bg-card rounded-md border cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {component.content}
    </div>
  );
};

const DroppableArea: React.FC<{ onDrop: (item: ComponentItem) => void }> = ({ onDrop }) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop<ComponentItem, unknown, { isOver: boolean }>(() => ({
    accept: "COMPONENT",
    drop: (item: ComponentItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`min-h-[200px] p-4 border-2 border-dashed rounded-md ${
        isOver ? "border-primary bg-primary/10" : "border-muted"
      }`}
    >
      {isOver ? "Drop component here" : "Drag and drop components here"}
    </div>
  );
};

export default function PageEditor() {
  const [components, setComponents] = useState<ComponentItem[]>([]);

  const handleDrop = (item: ComponentItem) => {
    setComponents((prev) => [...prev, { ...item, id: `${item.type}-${Date.now()}` }]);
  };

  const handleRemoveComponent = (id: string) => {
    setComponents((prev) => prev.filter((component) => component.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Page Editor</h1>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Available Components</h3>
              <div className="space-y-2">
                {availableComponents.map((component) => (
                  <DraggableComponent key={component.id} component={component} />
                ))}
              </div>
            </Card>
          </div>
          <div className="col-span-3">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Page Content</h3>
              <DroppableArea onDrop={handleDrop} />
              <div className="mt-4 space-y-4">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className="group relative p-4 bg-card rounded-md border"
                  >
                    <button
                      onClick={() => handleRemoveComponent(component.id)}
                      className="absolute top-2 right-2 p-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove component"
                    >
                      ×
                    </button>
                    {component.content}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DndProvider>
    </div>
  );
} 