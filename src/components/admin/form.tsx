import * as React from "react";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";

/** Native <select>/<input type=file> styled to match shadcn inputs. */
export const inputCls =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none file:mr-2 file:text-sm file:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30";

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UICard className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </UICard>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
        {label}
        {hint && (
          <span className="text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

export function Submit({ children = "Save" }: { children?: React.ReactNode }) {
  return <Button type="submit">{children}</Button>;
}

export function DeleteButton({
  children = "Delete",
}: {
  children?: React.ReactNode;
}) {
  return (
    <Button type="submit" variant="destructive">
      {children}
    </Button>
  );
}
