"use client";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

type DragContextValue = {
  listeners: Record<string, unknown>;
  attributes: Record<string, unknown>;
};

const DragCtx = createContext<DragContextValue | null>(null);

export function DragHandle() {
  const ctx = useContext(DragCtx);
  if (!ctx) return null;
  return (
    <button
      type="button"
      className="flex cursor-grab touch-none items-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
      {...ctx.attributes}
      {...ctx.listeners}
      aria-label="Drag to reorder"
    >
      <IconGripVertical size={18} />
    </button>
  );
}

export function SortableRow({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-10 opacity-50" : ""}
    >
      <DragCtx.Provider
        value={{
          listeners: listeners as unknown as Record<string, unknown>,
          attributes: attributes as unknown as Record<string, unknown>,
        }}
      >
        {children}
      </DragCtx.Provider>
    </div>
  );
}

export function SortableList({
  items,
  onReorder,
  children,
}: {
  items: { id: string }[];
  onReorder: (ids: string[]) => Promise<void>;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const ids = items.map((i) => i.id);
        const oldIndex = ids.indexOf(active.id as string);
        const newIndex = ids.indexOf(over.id as string);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = [...ids];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        await onReorder(reordered);
      }
    },
    [items, onReorder],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">{children}</div>
      </SortableContext>
      <DragOverlay>
        <div className="rotate-3 scale-105 opacity-90 shadow-2xl" />
      </DragOverlay>
    </DndContext>
  );
}
