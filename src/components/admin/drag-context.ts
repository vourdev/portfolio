import { createContext } from "react";

type DragContextValue = {
  listeners: Record<string, unknown>;
  attributes: Record<string, unknown>;
};

export const DragCtx = createContext<DragContextValue | null>(null);
