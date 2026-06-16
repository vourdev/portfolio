"use client";
import {
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DragCtx } from "./drag-context";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tabler-icon tabler-icon-grip-vertical"
      >
        <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
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
  const [ready, setReady] = useState(false);
  const [Core, setCore] = useState<typeof import("@/components/admin/sortable-core") | null>(null);

  useEffect(() => {
    import("@/components/admin/sortable-core")
      .then((mod) => { setCore(mod); setReady(true); })
      .catch(() => setReady(true));
  }, []);

  if (!ready || !Core) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <Core.SortableRowCore id={id}>{children}</Core.SortableRowCore>;
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
  const [ready, setReady] = useState(false);
  const [Core, setCore] = useState<typeof import("@/components/admin/sortable-core") | null>(null);

  useEffect(() => {
    import("@/components/admin/sortable-core")
      .then((mod) => { setCore(mod); setReady(true); })
      .catch(() => setReady(true));
  }, []);

  if (!ready || !Core) {
    return <div className="space-y-3">{children}</div>;
  }

  return (
    <Core.SortableListCore items={items} onReorder={onReorder}>
      {children}
    </Core.SortableListCore>
  );
}
